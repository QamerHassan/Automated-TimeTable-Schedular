# Ultra-Consecutive Genetic Algorithm Timetable Generation System
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
try:
    from .models import (CoreCourse, CohortCourse, ElectiveCourse, Room, SemesterStudents,
                         Timetable, Section, EnhancedSchedule, GlobalScheduleMatrix,
                         SubjectFrequencyRule, TimeSlotConfiguration)
    from .forms import TimetableGenerationForm
except ImportError:
    # For testing without Django
    from main.models import (CoreCourse, CohortCourse, ElectiveCourse, Room, SemesterStudents,
                            Timetable, Section, EnhancedSchedule, GlobalScheduleMatrix,
                            SubjectFrequencyRule, TimeSlotConfiguration)
    from main.forms import TimetableGenerationForm
from django.contrib.auth.decorators import login_required
from django.db.models import Sum
from django.core.files.storage import default_storage
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import random
import csv
import os
import io
import logging
import json
import pandas as pd
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill
from django.utils.text import slugify
from datetime import datetime, timedelta, time
from collections import defaultdict
import numpy as np
from typing import List, Dict, Tuple, Set, Optional
import copy

logger = logging.getLogger(__name__)

# ============ ULTRA-CONSECUTIVE GENETIC ALGORITHM CONFIGURATION ============
class GeneticConfig:
    """Ultra-optimized configuration for aggressive consecutive scheduling"""
    # Population parameters
    POPULATION_SIZE = 150  # Increased for better exploration
    GENERATIONS = 500      # More generations for fine-tuning
    ELITE_SIZE = 20        # More elites to preserve good patterns
    TOURNAMENT_SIZE = 8    # Larger tournament for better selection
    
    # Genetic operators
    CROSSOVER_RATE = 0.90  # Higher crossover for better mixing
    MUTATION_RATE = 0.08   # Lower mutation to preserve good patterns
    ADAPTIVE_MUTATION = True
    
    # Fitness weights (ULTRA-TUNED for consecutive scheduling)
    HARD_CONSTRAINT_WEIGHT = 3000.0      # Critical constraints
    CONSECUTIVE_CLASSES_WEIGHT = 2000.0   # MASSIVELY INCREASED: Consecutive scheduling
    SAME_DAY_COURSE_PENALTY = 1500.0      # Same course same day prevention
    FRIDAY_BREAK_WEIGHT = 800.0           # Friday break enforcement
    FLOW_OPTIMIZATION_WEIGHT = 1200.0     # INCREASED: Student flow optimization
    LOAD_BALANCE_WEIGHT = 600.0           # Daily load balancing
    PREFERENCE_WEIGHT = 400.0             # Time preferences
    ROOM_EFFICIENCY_WEIGHT = 200.0        # Room utilization
    
    # Ultra-consecutive scheduling constraints
    MAX_DAILY_CLASSES = 5                 # Allow more classes for better consecutive flow
    IDEAL_DAILY_CLASSES = 4               # Higher ideal for better packing
    MAX_CONSECUTIVE_GAP_HOURS = 1.5       # REDUCED: Stricter gap tolerance
    PERFECT_GAP_HOURS = 0.25              # 15 minutes - perfect consecutive
    GOOD_GAP_HOURS = 0.5                  # 30 minutes - good consecutive
    ACCEPTABLE_GAP_HOURS = 1.0            # 1 hour - acceptable
    FRIDAY_BREAK_START = time(12, 30)     # Friday break start
    FRIDAY_BREAK_END = time(14, 0)        # Friday break end
    
    # NEW: Ultra-consecutive specific parameters
    CONSECUTIVE_BONUS_MULTIPLIER = 3.0    # Massive bonus for consecutive classes
    GAP_PENALTY_MULTIPLIER = 2.0          # Heavy penalty for large gaps
    DAILY_COMPACTNESS_WEIGHT = 800.0     # NEW: Reward compact daily schedules
    MORNING_BLOCK_BONUS = 500.0          # NEW: Bonus for morning blocks
    AFTERNOON_BLOCK_BONUS = 400.0        # NEW: Bonus for afternoon blocks

CONFIG = GeneticConfig()

# Enhanced subject frequency mapping
SUBJECT_FREQUENCY_MAP = {
    # Theoretical subjects - 2 times per week
    "English-I": 2, "Calculus": 2, "Programming Fundamentals": 2,
    "ICT Theory": 2, "Information Security": 2, "Physics": 2,
    "Chemistry": 2, "Mathematics": 2, "Statistics": 2,
    "Applied Physics": 2, "Pak Study": 2, "Programming Fundamental Theory": 2,
    
    # Lab subjects - 1 time per week
    "Programming Fundamentals Lab": 1, "ICT Lab": 1,
    "Physics Lab": 1, "Chemistry Lab": 1, "Applied Physics Lab": 1,
    "Programming Fundamental Lab": 1,
}

# Enhanced time slots with Friday break consideration
THEORY_TIME_SLOTS = [
    "08:00-09:15", "09:30-10:45", "11:00-12:15",  # Morning block
    "12:30-13:45", "14:00-15:15", "15:30-16:45",  # Afternoon block  
    "17:00-18:15", "18:30-19:45", "20:00-21:15"   # Evening block
]

LAB_TIME_SLOTS = [
    "08:00-10:30", "11:00-13:30", "14:00-16:30",  # 2.5 hour lab slots
    "17:00-19:30"  # Evening lab slot
]

# Friday-specific time slots (respecting break)
FRIDAY_THEORY_SLOTS = [
    "08:00-09:15", "09:30-10:45", "11:00-12:15",  # Before break
    "14:00-15:15", "15:30-16:45", "17:00-18:15",  # After break
    "18:30-19:45", "20:00-21:15"                   # Evening
]

FRIDAY_LAB_SLOTS = [
    "08:00-10:30",   # Before break
    "14:00-16:30",   # After break
    "17:00-19:30"    # Evening
]

WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

# NEW: Time block definitions for ultra-consecutive scheduling
TIME_BLOCKS = {
    "morning": ["08:00-09:15", "09:30-10:45", "11:00-12:15"],
    "early_afternoon": ["12:30-13:45", "14:00-15:15", "15:30-16:45"],
    "evening": ["17:00-18:15", "18:30-19:45", "20:00-21:15"]
}

LAB_BLOCKS = {
    "morning": ["08:00-10:30"],
    "afternoon": ["11:00-13:30", "14:00-16:30"],
    "evening": ["17:00-19:30"]
}

# ============ ULTRA-CONSECUTIVE UTILITY FUNCTIONS ============
def is_friday_break_violation(day: str, time_slot: str) -> bool:
    """Check if time slot violates Friday break (12:30-14:00)"""
    if day != "Friday":
        return False
    
    try:
        start_time = datetime.strptime(time_slot.split("-")[0], "%H:%M").time()
        end_time = datetime.strptime(time_slot.split("-")[1], "%H:%M").time()
        
        # Check if slot overlaps with break time
        return not (end_time <= CONFIG.FRIDAY_BREAK_START or start_time >= CONFIG.FRIDAY_BREAK_END)
    except:
        return False

def get_available_slots(is_lab: bool, day: str) -> List[str]:
    """Enhanced slot availability with Friday break consideration"""
    if day == "Friday":
        return FRIDAY_LAB_SLOTS if is_lab else FRIDAY_THEORY_SLOTS
    else:
        return LAB_TIME_SLOTS if is_lab else THEORY_TIME_SLOTS

def calculate_time_gap(slot1: str, slot2: str) -> float:
    """Calculate gap in hours between two time slots"""
    try:
        end1 = datetime.strptime(slot1.split("-")[1], "%H:%M")
        start2 = datetime.strptime(slot2.split("-")[0], "%H:%M")
        gap_minutes = (start2 - end1).total_seconds() / 60
        return max(0, gap_minutes / 60.0)  # Convert to hours
    except:
        return 999.0  # Invalid gap

def get_time_block(time_slot: str, is_lab: bool) -> str:
    """NEW: Get the time block for a given time slot"""
    if is_lab:
        for block_name, slots in LAB_BLOCKS.items():
            if time_slot in slots:
                return block_name
    else:
        for block_name, slots in TIME_BLOCKS.items():
            if time_slot in slots:
                return block_name
    return "unknown"

def calculate_daily_compactness_score(time_slots: List[str]) -> float:
    """NEW: Calculate how compact a daily schedule is"""
    if len(time_slots) <= 1:
        return 1.0
    
    # Sort slots by start time
    sorted_slots = sorted(time_slots, key=lambda x: datetime.strptime(x.split("-")[0], "%H:%M"))
    
    # Calculate total span vs actual class time
    first_start = datetime.strptime(sorted_slots[0].split("-")[0], "%H:%M")
    last_end = datetime.strptime(sorted_slots[-1].split("-")[1], "%H:%M")
    total_span_hours = (last_end - first_start).total_seconds() / 3600
    
    # Calculate actual class time (assuming 1.25 hours per theory, 2.5 for lab)
    actual_class_hours = len(time_slots) * 1.25  # Simplified assumption
    
    # Compactness = actual time / total span (higher is better)
    if total_span_hours > 0:
        compactness = min(1.0, actual_class_hours / total_span_hours)
    else:
        compactness = 1.0
    
    return compactness

def check_same_course_same_day(genes: List, section_key: str) -> int:
    """Check for same course scheduled multiple times on same day"""
    violations = 0
    section_genes = [g for g in genes if f"{g.semester}-{g.section}" == section_key]
    
    # Group by day and subject
    daily_subjects = defaultdict(lambda: defaultdict(int))
    for gene in section_genes:
        daily_subjects[gene.day][gene.subject] += 1
    
    # Count violations (extra occurrences beyond 1 per day)
    for day, subjects in daily_subjects.items():
        for subject, count in subjects.items():
            if count > 1:
                violations += count - 1  # Each extra occurrence is a violation
    
    return violations

def calculate_ultra_consecutive_flow_score(genes: List, section_key: str) -> float:
    """ULTRA-ENHANCED: Calculate consecutive flow with aggressive optimization"""
    section_genes = [g for g in genes if f"{g.semester}-{g.section}" == section_key]
    
    total_flow_score = 0.0
    daily_schedules = defaultdict(list)
    
    # Group by day
    for gene in section_genes:
        daily_schedules[gene.day].append(gene.time_slot)
    
    # Analyze each day's flow with ultra-aggressive scoring
    for day, slots in daily_schedules.items():
        if len(slots) <= 1:
            total_flow_score += 1.0  # Perfect for single class
            continue
        
        # Sort slots by start time
        sorted_slots = sorted(slots, key=lambda x: datetime.strptime(x.split("-")[0], "%H:%M"))
        
        day_flow_score = 0.0
        consecutive_bonus = 0.0
        
        for i in range(len(sorted_slots) - 1):
            gap = calculate_time_gap(sorted_slots[i], sorted_slots[i + 1])
            
            if gap == CONFIG.PERFECT_GAP_HOURS:  # 15 minutes - PERFECT
                day_flow_score += 1.0
                consecutive_bonus += CONFIG.CONSECUTIVE_BONUS_MULTIPLIER
            elif gap <= CONFIG.GOOD_GAP_HOURS:  # 30 minutes - EXCELLENT
                day_flow_score += 0.9
                consecutive_bonus += CONFIG.CONSECUTIVE_BONUS_MULTIPLIER * 0.8
            elif gap <= CONFIG.ACCEPTABLE_GAP_HOURS:  # 1 hour - GOOD
                day_flow_score += 0.7
                consecutive_bonus += CONFIG.CONSECUTIVE_BONUS_MULTIPLIER * 0.5
            elif gap <= CONFIG.MAX_CONSECUTIVE_GAP_HOURS:  # 1.5 hours - ACCEPTABLE
                day_flow_score += 0.4
                consecutive_bonus += CONFIG.CONSECUTIVE_BONUS_MULTIPLIER * 0.2
            else:  # Too large gap - PENALTY
                day_flow_score += 0.0
                consecutive_bonus -= CONFIG.GAP_PENALTY_MULTIPLIER
        
        # Add compactness bonus
        compactness_score = calculate_daily_compactness_score(sorted_slots)
        day_flow_score += compactness_score * 0.5
        
        # Add time block bonus
        block_bonus = calculate_time_block_bonus(sorted_slots)
        day_flow_score += block_bonus
        
        # Average flow score for this day with bonuses
        if len(sorted_slots) > 1:
            base_score = day_flow_score / (len(sorted_slots) - 1)
            total_flow_score += base_score + (consecutive_bonus / len(sorted_slots))
        else:
            total_flow_score += 1.0
    
    # Return average flow score across all days
    return total_flow_score / len(WEEKDAYS) if daily_schedules else 1.0

def calculate_time_block_bonus(time_slots: List[str]) -> float:
    """NEW: Calculate bonus for scheduling within same time blocks"""
    if len(time_slots) <= 1:
        return 0.0
    
    # Count slots in each block
    block_counts = defaultdict(int)
    for slot in time_slots:
        block = get_time_block(slot, False)  # Assume theory for simplicity
        block_counts[block] += 1
    
    # Bonus for having multiple classes in same block
    bonus = 0.0
    for block, count in block_counts.items():
        if count >= 2:
            if block == "morning":
                bonus += CONFIG.MORNING_BLOCK_BONUS / 1000  # Normalize
            elif block == "early_afternoon":
                bonus += CONFIG.AFTERNOON_BLOCK_BONUS / 1000  # Normalize
            else:
                bonus += 0.1  # Small bonus for evening blocks
    
    return bonus

def get_subject_frequency(subject_name: str, is_lab: bool) -> int:
    """Enhanced frequency determination"""
    if is_lab:
        return 1
    return SUBJECT_FREQUENCY_MAP.get(subject_name, 2)

# ============ ULTRA-CONSECUTIVE GENETIC ALGORITHM CORE CLASSES ============
class Gene:
    """Ultra-enhanced gene with aggressive consecutive scheduling features"""
    def __init__(self, semester: int, section: str, subject: str, is_lab: bool, 
                 day: str = None, time_slot: str = None, room: str = None, 
                 teacher: str = None, session_number: int = 1):
        self.semester = semester
        self.section = section
        self.subject = subject
        self.is_lab = is_lab
        self.day = day or random.choice(WEEKDAYS)
        self.time_slot = time_slot or self._get_random_valid_slot()
        self.room = room or "TBD"
        self.teacher = teacher
        self.session_number = session_number
        
        # Ensure valid assignment
        if not self.is_valid_assignment():
            self.repair_assignment()
    
    def _get_random_valid_slot(self) -> str:
        """Get random valid time slot based on class type and day"""
        available_slots = get_available_slots(self.is_lab, self.day)
        return random.choice(available_slots) if available_slots else "08:00-09:15"
    
    def is_valid_assignment(self) -> bool:
        """Check if current assignment is valid"""
        available_slots = get_available_slots(self.is_lab, self.day)
        return (self.time_slot in available_slots and 
                not is_friday_break_violation(self.day, self.time_slot))
    
    def repair_assignment(self):
        """Repair invalid assignment"""
        available_slots = get_available_slots(self.is_lab, self.day)
        if available_slots:
            self.time_slot = random.choice(available_slots)
        else:
            # Fallback to different day
            self.day = random.choice([d for d in WEEKDAYS if d != "Friday"])
            self.time_slot = self._get_random_valid_slot()

class Chromosome:
    """Ultra-enhanced chromosome with aggressive consecutive optimization"""
    
    def __init__(self, genes: List[Gene] = None):
        self.genes = genes or []
        self.fitness = 0.0
        self.conflicts = []
        self.consecutive_flow_score = 0.0
        self.same_day_violations = 0
        self.friday_break_violations = 0
        self.daily_compactness_score = 0.0
        
    def initialize_random(self, semesters_data: Dict):
        """Initialize with ultra-consecutive random assignment"""
        self.genes = []
        
        # Create genes for all subjects
        for semester, sections_data in semesters_data.items():
            for section_name, subjects in sections_data.items():
                for subject_info in subjects:
                    frequency = get_subject_frequency(subject_info['name'], subject_info['is_lab'])
                    
                    for session in range(frequency):
                        gene = Gene(
                            semester=semester,
                            section=section_name,
                            subject=subject_info['name'],
                            is_lab=subject_info['is_lab'],
                            session_number=session + 1
                        )
                        self.genes.append(gene)
        
        # Ultra-consecutive initialization with aggressive optimization
        self._assign_time_slots_ultra_consecutively()
        self._assign_rooms_intelligently()
        
    def _assign_time_slots_ultra_consecutively(self):
        """ULTRA-ENHANCED: Aggressive consecutive time slot assignment"""
        # Track occupied slots and subjects per section per day
        section_schedules = defaultdict(lambda: defaultdict(set))
        section_daily_subjects = defaultdict(lambda: defaultdict(set))
        
        # Sort genes by priority (labs first, then by subject, then by session)
        sorted_genes = sorted(self.genes, key=lambda g: (not g.is_lab, g.subject, g.session_number))
        
        for gene in sorted_genes:
            section_key = f"{gene.semester}-{gene.section}"
            best_assignment = None
            best_score = -999999  # Start very low for aggressive optimization
            
            # Try all days and slots with ultra-aggressive scoring
            for day in WEEKDAYS:
                # Skip if subject already scheduled on this day
                if gene.subject in section_daily_subjects[section_key][day]:
                    continue
                
                available_slots = get_available_slots(gene.is_lab, day)
                
                for slot in available_slots:
                    if slot not in section_schedules[section_key][day]:
                        # Calculate ultra-consecutive assignment score
                        score = self._calculate_ultra_consecutive_assignment_score(
                            gene, day, slot, section_schedules[section_key], 
                            section_daily_subjects[section_key]
                        )
                        
                        if score > best_score:
                            best_score = score
                            best_assignment = (day, slot)
            
            # Assign best slot or ultra-consecutive fallback
            if best_assignment:
                gene.day, gene.time_slot = best_assignment
                section_schedules[section_key][gene.day].add(gene.time_slot)
                section_daily_subjects[section_key][gene.day].add(gene.subject)
            else:
                # Ultra-consecutive fallback assignment
                self._ultra_consecutive_fallback_assignment(gene, section_schedules[section_key], 
                                                          section_daily_subjects[section_key])
    
    def _calculate_ultra_consecutive_assignment_score(self, gene: Gene, day: str, slot: str, 
                                                    section_schedule: Dict, section_daily_subjects: Dict) -> float:
        """ULTRA-ENHANCED: Aggressive assignment scoring for consecutive flow"""
        score = 10.0  # Higher base score
        
        # CRITICAL: Massive bonus for not having this subject on this day already
        if gene.subject not in section_daily_subjects[day]:
            score += 50.0  # Increased from 3.0
        
        # ULTRA-CONSECUTIVE: Aggressive consecutive flow bonus
        existing_slots = list(section_schedule[day])
        if existing_slots:
            # Find best consecutive placement with ultra-aggressive scoring
            all_slots = existing_slots + [slot]
            sorted_slots = sorted(all_slots, key=lambda x: datetime.strptime(x.split("-")[0], "%H:%M"))
            
            # Ultra-aggressive bonus for creating perfect consecutive flow
            slot_index = sorted_slots.index(slot)
            
            if slot_index > 0:  # Has previous slot
                gap_before = calculate_time_gap(sorted_slots[slot_index - 1], slot)
                if gap_before == CONFIG.PERFECT_GAP_HOURS:  # 15 minutes - PERFECT
                    score += 100.0  # MASSIVE bonus
                elif gap_before <= CONFIG.GOOD_GAP_HOURS:  # 30 minutes - EXCELLENT
                    score += 80.0
                elif gap_before <= CONFIG.ACCEPTABLE_GAP_HOURS:  # 1 hour - GOOD
                    score += 50.0
                elif gap_before <= CONFIG.MAX_CONSECUTIVE_GAP_HOURS:  # 1.5 hours - ACCEPTABLE
                    score += 20.0
                else:  # Too large gap - PENALTY
                    score -= 50.0
            
            if slot_index < len(sorted_slots) - 1:  # Has next slot
                gap_after = calculate_time_gap(slot, sorted_slots[slot_index + 1])
                if gap_after == CONFIG.PERFECT_GAP_HOURS:  # 15 minutes - PERFECT
                    score += 100.0  # MASSIVE bonus
                elif gap_after <= CONFIG.GOOD_GAP_HOURS:  # 30 minutes - EXCELLENT
                    score += 80.0
                elif gap_after <= CONFIG.ACCEPTABLE_GAP_HOURS:  # 1 hour - GOOD
                    score += 50.0
                elif gap_after <= CONFIG.MAX_CONSECUTIVE_GAP_HOURS:  # 1.5 hours - ACCEPTABLE
                    score += 20.0
                else:  # Too large gap - PENALTY
                    score -= 50.0
            
            # NEW: Time block bonus for staying within same block
            current_block = get_time_block(slot, gene.is_lab)
            existing_blocks = [get_time_block(s, gene.is_lab) for s in existing_slots]
            if current_block in existing_blocks:
                score += 30.0  # Bonus for same time block
        
        # Enhanced preference bonuses
        if not gene.is_lab:
            # Morning preference for theory
            if slot in TIME_BLOCKS["morning"]:
                score += 15.0
            # Afternoon preference
            elif slot in TIME_BLOCKS["early_afternoon"]:
                score += 10.0
        else:
            # Afternoon preference for labs
            if slot in LAB_BLOCKS["afternoon"]:
                score += 12.0
        
        # Friday afternoon bonus (after break)
        if day == "Friday" and slot in ["14:00-15:15", "15:30-16:45"]:
            score += 8.0
        
        # NEW: Daily load balancing consideration
        current_day_load = len(section_schedule[day])
        if current_day_load < CONFIG.IDEAL_DAILY_CLASSES:
            score += 5.0  # Bonus for filling up to ideal
        elif current_day_load >= CONFIG.MAX_DAILY_CLASSES:
            score -= 20.0  # Penalty for overloading
        
        return score
    
    def _ultra_consecutive_fallback_assignment(self, gene: Gene, section_schedule: Dict, 
                                             section_daily_subjects: Dict):
        """ULTRA-ENHANCED: Fallback with aggressive consecutive preference"""
        # Find days where this subject isn't already scheduled
        available_days = [day for day in WEEKDAYS 
                         if gene.subject not in section_daily_subjects[day]]
        
        if not available_days:
            available_days = WEEKDAYS
        
        # Score each available day for consecutive potential
        day_scores = {}
        for day in available_days:
            day_score = 0.0
            existing_slots = list(section_schedule[day])
            
            if existing_slots:
                # Prefer days with existing classes for better consecutive flow
                day_score += len(existing_slots) * 10.0
                
                # Check if we can create good consecutive flow
                available_slots = get_available_slots(gene.is_lab, day)
                for slot in available_slots:
                    if slot not in existing_slots:
                        min_gap = min(calculate_time_gap(slot, existing) for existing in existing_slots)
                        if min_gap <= CONFIG.PERFECT_GAP_HOURS:
                            day_score += 50.0
                        elif min_gap <= CONFIG.GOOD_GAP_HOURS:
                            day_score += 30.0
                        elif min_gap <= CONFIG.ACCEPTABLE_GAP_HOURS:
                            day_score += 15.0
            else:
                # Small bonus for empty days (fresh start)
                day_score += 5.0
            
            day_scores[day] = day_score
        
        # Choose best day
        best_day = max(day_scores.keys(), key=lambda d: day_scores[d])
        gene.day = best_day
        
        # Assign best consecutive time slot for this day
        available_slots = get_available_slots(gene.is_lab, gene.day)
        existing_slots = list(section_schedule[gene.day])
        
        if available_slots:
            if existing_slots:
                # Find slot that creates best consecutive flow
                best_slot = None
                best_gap = float('inf')
                
                for slot in available_slots:
                    if slot not in existing_slots:
                        min_gap = min(calculate_time_gap(slot, existing) for existing in existing_slots)
                        if min_gap < best_gap:
                            best_gap = min_gap
                            best_slot = slot
                
                gene.time_slot = best_slot if best_slot else random.choice(available_slots)
            else:
                # Prefer morning slots for fresh start
                morning_slots = [s for s in available_slots if s in TIME_BLOCKS["morning"]]
                gene.time_slot = random.choice(morning_slots) if morning_slots else random.choice(available_slots)
        else:
            gene.time_slot = "08:00-09:15"
    
    def _assign_rooms_intelligently(self):
        """Enhanced room assignment"""
        lab_rooms = list(Room.objects.filter(lab=True))
        theory_rooms = list(Room.objects.filter(core_sub=True))
        backup_rooms = list(Room.objects.filter(cohort_sub=True))
        
        for gene in self.genes:
            if gene.is_lab and lab_rooms:
                gene.room = random.choice(lab_rooms).room_number
            elif theory_rooms:
                gene.room = random.choice(theory_rooms).room_number
            elif backup_rooms:
                gene.room = random.choice(backup_rooms).room_number
            else:
                gene.room = f"ROOM-{random.randint(100, 999)}"
    
    def evaluate_fitness(self):
        """ULTRA-ENHANCED: Fitness evaluation with aggressive consecutive optimization"""
        self.fitness = 0.0
        self.conflicts = []
        self.consecutive_flow_score = 0.0
        self.same_day_violations = 0
        self.friday_break_violations = 0
        self.daily_compactness_score = 0.0
        
        # 1. Check hard constraints (no simultaneous classes)
        simultaneous_conflicts = self._check_simultaneous_classes()
        if len(simultaneous_conflicts) > 0:
            # Zero tolerance for simultaneous classes
            self.fitness = 0
            self.conflicts = simultaneous_conflicts
            return 0
        
        # 2. Check same course on same day violations
        same_day_violations = 0
        section_keys = set(f"{g.semester}-{g.section}" for g in self.genes)
        for section_key in section_keys:
            same_day_violations += check_same_course_same_day(self.genes, section_key)
        
        self.same_day_violations = same_day_violations
        
        # 3. Check Friday break violations
        friday_violations = sum(1 for gene in self.genes 
                              if is_friday_break_violation(gene.day, gene.time_slot))
        self.friday_break_violations = friday_violations
        
        # If there are critical violations, apply severe penalties
        if same_day_violations > 0 or friday_violations > 0:
            penalty = same_day_violations * 200 + friday_violations * 150
            self.fitness = max(0, CONFIG.HARD_CONSTRAINT_WEIGHT - penalty)
            return self.fitness
        
        # 4. Base fitness for no critical violations
        self.fitness = CONFIG.HARD_CONSTRAINT_WEIGHT
        
        # 5. ULTRA-CONSECUTIVE: Aggressive consecutive flow optimization
        total_flow_score = 0.0
        total_compactness_score = 0.0
        section_count = 0
        
        for section_key in section_keys:
            flow_score = calculate_ultra_consecutive_flow_score(self.genes, section_key)
            total_flow_score += flow_score
            
            # Calculate daily compactness for this section
            section_genes = [g for g in self.genes if f"{g.semester}-{g.section}" == section_key]
            daily_schedules = defaultdict(list)
            for gene in section_genes:
                daily_schedules[gene.day].append(gene.time_slot)
            
            section_compactness = 0.0
            for day, slots in daily_schedules.items():
                section_compactness += calculate_daily_compactness_score(slots)
            
            total_compactness_score += section_compactness / len(daily_schedules) if daily_schedules else 1.0
            section_count += 1
        
        self.consecutive_flow_score = total_flow_score / section_count if section_count > 0 else 0.0
        self.daily_compactness_score = total_compactness_score / section_count if section_count > 0 else 0.0
        
        # MASSIVE fitness boost for consecutive flow
        self.fitness += CONFIG.CONSECUTIVE_CLASSES_WEIGHT * self.consecutive_flow_score
        
        # NEW: Daily compactness bonus
        self.fitness += CONFIG.DAILY_COMPACTNESS_WEIGHT * self.daily_compactness_score
        
        # 6. Other optimization components
        room_conflicts = self._check_room_conflicts()
        self.fitness -= len(room_conflicts) * 75  # Increased penalty
        
        daily_load_penalty = self._check_daily_load_balance()
        self.fitness -= daily_load_penalty * 50  # Increased penalty
        
        frequency_penalty = self._check_theoretical_frequency()
        self.fitness -= frequency_penalty * 60  # Increased penalty
        
        # 7. Enhanced bonuses for good practices
        preference_bonus = self._calculate_preference_bonus()
        self.fitness += preference_bonus * CONFIG.PREFERENCE_WEIGHT / 100
        
        room_efficiency_bonus = self._calculate_room_efficiency()
        self.fitness += room_efficiency_bonus * CONFIG.ROOM_EFFICIENCY_WEIGHT / 100
        
        # NEW: Time block consistency bonus
        block_consistency_bonus = self._calculate_block_consistency_bonus()
        self.fitness += block_consistency_bonus
        
        # Store all conflicts
        self.conflicts = simultaneous_conflicts + room_conflicts
        
        return self.fitness
    
    def _calculate_block_consistency_bonus(self) -> float:
        """NEW: Calculate bonus for consistent time block usage"""
        bonus = 0.0
        section_keys = set(f"{g.semester}-{g.section}" for g in self.genes)
        
        for section_key in section_keys:
            section_genes = [g for g in self.genes if f"{g.semester}-{g.section}" == section_key]
            daily_schedules = defaultdict(list)
            
            for gene in section_genes:
                daily_schedules[gene.day].append(gene.time_slot)
            
            for day, slots in daily_schedules.items():
                if len(slots) >= 2:
                    # Check if slots are in same time block
                    blocks = [get_time_block(slot, False) for slot in slots]
                    unique_blocks = set(blocks)
                    
                    if len(unique_blocks) == 1:
                        # All classes in same block - big bonus
                        bonus += 100.0
                    elif len(unique_blocks) == 2:
                        # Classes in two blocks - medium bonus
                        bonus += 50.0
        
        return bonus
    
    def _check_simultaneous_classes(self) -> List[Dict]:
        """Check for simultaneous classes - zero tolerance"""
        conflicts = []
        section_schedule = defaultdict(lambda: defaultdict(list))
        
        for gene in self.genes:
            section_key = f"{gene.semester}-{gene.section}"
            time_key = f"{gene.day}-{gene.time_slot}"
            section_schedule[section_key][time_key].append(gene.subject)
        
        for section_key, schedule in section_schedule.items():
            for time_key, subjects in schedule.items():
                if len(subjects) > 1:
                    conflicts.append({
                        'type': 'simultaneous_classes',
                        'section': section_key,
                        'time': time_key,
                        'subjects': subjects,
                        'count': len(subjects)
                    })
        
        return conflicts
    
    def _check_room_conflicts(self) -> List[Dict]:
        """Check for room booking conflicts"""
        conflicts = []
        room_schedule = defaultdict(set)
        
        for gene in self.genes:
            if gene.room and gene.room != "TBD":
                time_room_key = f"{gene.day}-{gene.time_slot}-{gene.room}"
                
                if time_room_key in room_schedule:
                    conflicts.append({
                        'type': 'room_conflict',
                        'room': gene.room,
                        'time': f"{gene.day}-{gene.time_slot}"
                    })
                
                room_schedule[time_room_key].add(f"S{gene.semester}-{gene.section}")
        
        return conflicts
    
    def _check_daily_load_balance(self) -> int:
        """Check for balanced daily class loads"""
        penalties = 0
        daily_loads = defaultdict(lambda: defaultdict(int))
        
        for gene in self.genes:
            section_key = f"{gene.semester}-{gene.section}"
            daily_loads[section_key][gene.day] += 1
        
        for section, days in daily_loads.items():
            for day, count in days.items():
                if count > CONFIG.MAX_DAILY_CLASSES:
                    penalties += count - CONFIG.MAX_DAILY_CLASSES
        
        return penalties
    
    def _check_theoretical_frequency(self) -> int:
        """Check if theoretical subjects are scheduled correctly"""
        penalties = 0
        subject_counts = defaultdict(int)
        
        for gene in self.genes:
            if not gene.is_lab:
                key = f"{gene.semester}-{gene.section}-{gene.subject}"
                subject_counts[key] += 1
        
        for subject_key, count in subject_counts.items():
            expected_frequency = 2
            if count != expected_frequency:
                penalties += abs(count - expected_frequency)
        
        return penalties
    
    def _calculate_preference_bonus(self) -> float:
        """Calculate bonus for preferred time slots"""
        bonus = 0.0
        morning_theory_count = 0
        afternoon_lab_count = 0
        
        for gene in self.genes:
            if not gene.is_lab and gene.time_slot in TIME_BLOCKS["morning"]:
                morning_theory_count += 1
            elif gene.is_lab and gene.time_slot in LAB_BLOCKS["afternoon"]:
                afternoon_lab_count += 1
        
        total_theory = sum(1 for g in self.genes if not g.is_lab)
        total_lab = sum(1 for g in self.genes if g.is_lab)
        
        if total_theory > 0:
            bonus += (morning_theory_count / total_theory) * 60
        if total_lab > 0:
            bonus += (afternoon_lab_count / total_lab) * 60
        
        return bonus
    
    def _calculate_room_efficiency(self) -> float:
        """Calculate room utilization efficiency"""
        room_usage = defaultdict(int)
        for gene in self.genes:
            if gene.room != "TBD":
                room_usage[gene.room] += 1
        
        if not room_usage:
            return 0.0
        
        # Prefer balanced room usage
        usage_values = list(room_usage.values())
        avg_usage = np.mean(usage_values)
        std_usage = np.std(usage_values) if len(usage_values) > 1 else 0
        
        # Lower standard deviation = better balance
        efficiency = max(0, 100 - std_usage * 10)
        return efficiency
    
    def repair_conflicts(self):
        """Enhanced conflict repair with ultra-consecutive strategies"""
        # Repair simultaneous classes
        self._repair_simultaneous_classes()
        
        # Repair same-day course violations
        self._repair_same_day_violations()
        
        # Repair Friday break violations
        self._repair_friday_break_violations()
        
        # NEW: Optimize for consecutive flow
        self._optimize_consecutive_flow()
    
    def _optimize_consecutive_flow(self):
        """NEW: Actively optimize for better consecutive flow"""
        section_keys = set(f"{g.semester}-{g.section}" for g in self.genes)
        
        for section_key in section_keys:
            section_genes = [g for g in self.genes if f"{g.semester}-{g.section}" == section_key]
            daily_schedules = defaultdict(list)
            
            for gene in section_genes:
                daily_schedules[gene.day].append(gene)
            
            # For each day with multiple classes, try to optimize consecutive flow
            for day, genes in daily_schedules.items():
                if len(genes) >= 2:
                    self._optimize_daily_consecutive_flow(genes, day)
    
    def _optimize_daily_consecutive_flow(self, genes: List[Gene], day: str):
        """NEW: Optimize consecutive flow for a specific day"""
        if len(genes) < 2:
            return
        
        # Get all available slots for this day
        available_theory_slots = [s for s in get_available_slots(False, day)]
        available_lab_slots = [s for s in get_available_slots(True, day)]
        
        # Separate theory and lab genes
        theory_genes = [g for g in genes if not g.is_lab]
        lab_genes = [g for g in genes if g.is_lab]
        
        # Try to create consecutive blocks for theory classes
        if len(theory_genes) >= 2:
            self._create_consecutive_block(theory_genes, available_theory_slots)
        
        # Handle lab genes separately (they need longer slots)
        for lab_gene in lab_genes:
            # Try to place lab adjacent to theory block if possible
            if theory_genes:
                self._place_lab_adjacent_to_theory(lab_gene, theory_genes, available_lab_slots)
    
    def _create_consecutive_block(self, genes: List[Gene], available_slots: List[str]):
        """NEW: Create a consecutive block of classes"""
        if len(genes) < 2 or len(available_slots) < len(genes):
            return
        
        # Sort available slots by time
        sorted_slots = sorted(available_slots, key=lambda x: datetime.strptime(x.split("-")[0], "%H:%M"))
        
        # Find the best consecutive sequence
        best_sequence = None
        best_score = -1
        
        for start_idx in range(len(sorted_slots) - len(genes) + 1):
            sequence = sorted_slots[start_idx:start_idx + len(genes)]
            
            # Calculate consecutive score for this sequence
            score = 0
            for i in range(len(sequence) - 1):
                gap = calculate_time_gap(sequence[i], sequence[i + 1])
                if gap == CONFIG.PERFECT_GAP_HOURS:
                    score += 100
                elif gap <= CONFIG.GOOD_GAP_HOURS:
                    score += 80
                elif gap <= CONFIG.ACCEPTABLE_GAP_HOURS:
                    score += 50
                else:
                    score -= 20
            
            if score > best_score:
                best_score = score
                best_sequence = sequence
        
        # Assign the best sequence to genes
        if best_sequence and best_score > 0:
            for i, gene in enumerate(genes):
                gene.time_slot = best_sequence[i]
    
    def _place_lab_adjacent_to_theory(self, lab_gene: Gene, 
                                    theory_genes: List[Gene], 
                                    available_lab_slots: List[str]):
        """NEW: Place lab class adjacent to theory classes"""
        if not theory_genes or not available_lab_slots:
            return
        
        # Get theory time range
        theory_slots = [g.time_slot for g in theory_genes]
        theory_start_times = [datetime.strptime(slot.split("-")[0], "%H:%M") for slot in theory_slots]
        theory_end_times = [datetime.strptime(slot.split("-")[1], "%H:%M") for slot in theory_slots]
        
        earliest_theory = min(theory_start_times)
        latest_theory = max(theory_end_times)
        
        # Find lab slot that's closest to theory block
        best_lab_slot = None
        best_gap = float('inf')
        
        for lab_slot in available_lab_slots:
            lab_start = datetime.strptime(lab_slot.split("-")[0], "%H:%M")
            lab_end = datetime.strptime(lab_slot.split("-")[1], "%H:%M")
            
            # Calculate gap to theory block
            if lab_end <= earliest_theory:
                # Lab before theory
                gap = (earliest_theory - lab_end).total_seconds() / 3600
            elif lab_start >= latest_theory:
                # Lab after theory
                gap = (lab_start - latest_theory).total_seconds() / 3600
            else:
                # Lab overlaps with theory (not ideal, but possible)
                gap = 0
            
            if gap < best_gap:
                best_gap = gap
                best_lab_slot = lab_slot
        
        if best_lab_slot and best_gap <= 2.0:  # Within 2 hours
            lab_gene.time_slot = best_lab_slot
    
    def _repair_simultaneous_classes(self):
        """Repair simultaneous class conflicts"""
        section_schedule = defaultdict(lambda: defaultdict(list))
        
        # Group genes by section and time
        for gene in self.genes:
            section_key = f"{gene.semester}-{gene.section}"
            time_key = f"{gene.day}-{gene.time_slot}"
            section_schedule[section_key][time_key].append(gene)
        
        # Fix conflicts
        for section_key, schedule in section_schedule.items():
            for time_key, genes in schedule.items():
                if len(genes) > 1:
                    # Keep first gene, reassign others
                    for gene in genes[1:]:
                        self._reassign_gene_safely(gene, section_schedule[section_key])
    
    def _repair_same_day_violations(self):
        """Repair same course on same day violations"""
        section_daily_subjects = defaultdict(lambda: defaultdict(list))
        
        # Group by section, day, and subject
        for gene in self.genes:
            section_key = f"{gene.semester}-{gene.section}"
            section_daily_subjects[section_key][gene.day].append(gene)
        
        # Fix violations
        for section_key, daily_schedule in section_daily_subjects.items():
            for day, genes in daily_schedule.items():
                # Group by subject
                subject_genes = defaultdict(list)
                for gene in genes:
                    subject_genes[gene.subject].append(gene)
                
                # If any subject has multiple genes on same day, reassign extras
                for subject, subject_gene_list in subject_genes.items():
                    if len(subject_gene_list) > 1:
                        # Keep first gene, reassign others to different days
                        for gene in subject_gene_list[1:]:
                            self._reassign_gene_to_different_day(gene, section_key, subject)
    
    def _repair_friday_break_violations(self):
        """Repair Friday break violations"""
        for gene in self.genes:
            if is_friday_break_violation(gene.day, gene.time_slot):
                # Try to find valid Friday slot
                available_friday_slots = get_available_slots(gene.is_lab, "Friday")
                valid_friday_slots = [slot for slot in available_friday_slots 
                                    if not is_friday_break_violation("Friday", slot)]
                
                if valid_friday_slots:
                    gene.time_slot = random.choice(valid_friday_slots)
                else:
                    # Move to different day
                    gene.day = random.choice([d for d in WEEKDAYS if d != "Friday"])
                    gene.time_slot = gene._get_random_valid_slot()
    
    def _reassign_gene_safely(self, gene: Gene, section_schedule: Dict):
        """Safely reassign a gene to avoid conflicts"""
        attempts = 0
        max_attempts = 50
        
        while attempts < max_attempts:
            gene.day = random.choice(WEEKDAYS)
            available_slots = get_available_slots(gene.is_lab, gene.day)
            if available_slots:
                gene.time_slot = random.choice(available_slots)
                
                time_key = f"{gene.day}-{gene.time_slot}"
                if time_key not in section_schedule or len(section_schedule[time_key]) == 0:
                    break
            
            attempts += 1
    
    def _reassign_gene_to_different_day(self, gene: Gene, section_key: str, subject: str):
        """Reassign gene to a different day where subject isn't already scheduled"""
        # Find days where this subject isn't scheduled for this section
        occupied_days = set()
        for g in self.genes:
            if (f"{g.semester}-{g.section}" == section_key and 
                g.subject == subject and g != gene):
                occupied_days.add(g.day)
        
        available_days = [day for day in WEEKDAYS if day not in occupied_days]
        
        if available_days:
            gene.day = random.choice(available_days)
            available_slots = get_available_slots(gene.is_lab, gene.day)
            if available_slots:
                gene.time_slot = random.choice(available_slots)

class GeneticAlgorithm:
    """Ultra-enhanced genetic algorithm with aggressive consecutive optimization"""
    
    def __init__(self, config: GeneticConfig = None):
        self.config = config or CONFIG
        self.population: List[Chromosome] = []
        self.best_chromosome: Optional[Chromosome] = None
        self.generation = 0
        self.fitness_history = []
        self.stagnation_counter = 0
        
    def evolve(self, semesters_data: Dict) -> Chromosome:
        """Ultra-enhanced evolution with aggressive consecutive optimization"""
        logger.info(f"Starting ULTRA-CONSECUTIVE evolution with {self.config.GENERATIONS} generations")
        logger.info(f"Population size: {self.config.POPULATION_SIZE}")
        logger.info("ULTRA features: Aggressive consecutive classes, same-day prevention, Friday break")
        
        # Initialize population
        self._initialize_population(semesters_data)
        
        # Evolution loop
        for generation in range(self.config.GENERATIONS):
            self.generation = generation
            
            # Evaluate population
            for chromosome in self.population:
                chromosome.evaluate_fitness()
            
            # Sort by fitness
            self.population.sort(key=lambda x: x.fitness, reverse=True)
            
            # Track best chromosome
            current_best = self.population[0]
            if not self.best_chromosome or current_best.fitness > self.best_chromosome.fitness:
                self.best_chromosome = copy.deepcopy(current_best)
                self.stagnation_counter = 0
            else:
                self.stagnation_counter += 1
            
            # Log progress
            if generation % 25 == 0:
                logger.info(f"Generation {generation}: Best={current_best.fitness:.2f}, "
                          f"Flow={current_best.consecutive_flow_score:.3f}, "
                          f"Compactness={current_best.daily_compactness_score:.3f}, "
                          f"Same-day violations={current_best.same_day_violations}, "
                          f"Friday violations={current_best.friday_break_violations}")
            
            self.fitness_history.append(current_best.fitness)
            
            # Early termination for ultra-excellent solutions
            if (current_best.fitness > 4000 and 
                current_best.same_day_violations == 0 and 
                current_best.friday_break_violations == 0 and
                current_best.consecutive_flow_score > 0.9):
                logger.info(f"ULTRA-EXCELLENT consecutive solution found at generation {generation}")
                break
            
            # Create next generation
            self._create_next_generation()
            
            # Adaptive mutation
            if self.config.ADAPTIVE_MUTATION and self.stagnation_counter > 30:
                self.config.MUTATION_RATE = min(0.20, self.config.MUTATION_RATE * 1.1)
                self.stagnation_counter = 0
        
        logger.info(f"ULTRA-CONSECUTIVE evolution completed. Best fitness: {self.best_chromosome.fitness:.2f}")
        logger.info(f"Final consecutive flow score: {self.best_chromosome.consecutive_flow_score:.3f}")
        logger.info(f"Final daily compactness score: {self.best_chromosome.daily_compactness_score:.3f}")
        logger.info(f"Final same-day violations: {self.best_chromosome.same_day_violations}")
        logger.info(f"Final Friday break violations: {self.best_chromosome.friday_break_violations}")
        
        return self.best_chromosome
    
    def _initialize_population(self, semesters_data: Dict):
        """Initialize population with ultra-consecutive strategies"""
        logger.info(f"Initializing ULTRA-CONSECUTIVE population of size {self.config.POPULATION_SIZE}")
        
        self.population = []
        for i in range(self.config.POPULATION_SIZE):
            chromosome = Chromosome()
            chromosome.initialize_random(semesters_data)
            chromosome.repair_conflicts()  # Ensure initial quality
            self.population.append(chromosome)
        
        logger.info(f"Created {len(self.population)} ultra-consecutive chromosomes")
    
    def _create_next_generation(self):
        """Create next generation with ultra-enhanced operators"""
        new_population = []
        
        # Elite selection (only ultra-high-quality individuals)
        elite_candidates = [c for c in self.population 
                          if c.same_day_violations == 0 and c.friday_break_violations == 0 
                          and c.consecutive_flow_score > 0.5]
        if elite_candidates:
            elite_size = min(self.config.ELITE_SIZE, len(elite_candidates))
            new_population.extend(elite_candidates[:elite_size])
        else:
            # Fallback to best individuals
            elite_size = min(self.config.ELITE_SIZE, len(self.population))
            new_population.extend(self.population[:elite_size])
        
        # Generate offspring
        while len(new_population) < self.config.POPULATION_SIZE:
            parent1 = self._ultra_enhanced_selection()
            parent2 = self._ultra_enhanced_selection()
            
            child1, child2 = self._ultra_enhanced_crossover(parent1, parent2)
            
            self._ultra_enhanced_mutation(child1)
            self._ultra_enhanced_mutation(child2)
            
            # Repair conflicts in children
            child1.repair_conflicts()
            child2.repair_conflicts()
            
            new_population.extend([child1, child2])
        
        self.population = new_population[:self.config.POPULATION_SIZE]
    
    def _ultra_enhanced_selection(self) -> Chromosome:
        """Ultra-enhanced selection with consecutive flow preference"""
        tournament_size = self.config.TOURNAMENT_SIZE
        tournament = random.sample(self.population, min(tournament_size, len(self.population)))
        
        # Prefer chromosomes with no violations and excellent consecutive flow
        ultra_quality = [c for c in tournament 
                        if c.same_day_violations == 0 and c.friday_break_violations == 0 
                        and c.consecutive_flow_score > 0.7]
        
        if ultra_quality:
            # Among ultra quality, prefer better consecutive flow and compactness
            return max(ultra_quality, key=lambda x: (x.fitness, x.consecutive_flow_score, x.daily_compactness_score))
        else:
            high_quality = [c for c in tournament 
                           if c.same_day_violations == 0 and c.friday_break_violations == 0]
            if high_quality:
                return max(high_quality, key=lambda x: (x.fitness, x.consecutive_flow_score))
            else:
                return max(tournament, key=lambda x: x.fitness)
    
    def _ultra_enhanced_crossover(self, parent1: Chromosome, 
                                parent2: Chromosome) -> Tuple[Chromosome, Chromosome]:
        """Ultra-enhanced crossover preserving consecutive patterns"""
        if random.random() > self.config.CROSSOVER_RATE:
            return copy.deepcopy(parent1), copy.deepcopy(parent2)
        
        # Multi-point crossover for better consecutive pattern preservation
        min_length = min(len(parent1.genes), len(parent2.genes))
        if min_length < 8:
            return copy.deepcopy(parent1), copy.deepcopy(parent2)
        
        # Use 3 crossover points for better mixing
        point1 = random.randint(1, min_length // 4)
        point2 = random.randint(min_length // 2, 3 * min_length // 4)
        point3 = random.randint(3 * min_length // 4, min_length - 1)
        
        child1 = Chromosome()
        child2 = Chromosome()
        
        child1.genes = (parent1.genes[:point1] + 
                       parent2.genes[point1:point2] + 
                       parent1.genes[point2:point3] +
                       parent2.genes[point3:])
        child2.genes = (parent2.genes[:point1] + 
                       parent1.genes[point1:point2] + 
                       parent2.genes[point2:point3] +
                       parent1.genes[point3:])
        
        return child1, child2
    
    def _ultra_enhanced_mutation(self, chromosome: Chromosome):
        """Ultra-enhanced mutation with consecutive flow optimization"""
        for gene in chromosome.genes:
            if random.random() < self.config.MUTATION_RATE:
                mutation_type = random.choice(['ultra_consecutive', 'smart_consecutive', 'day', 'time', 'both'])
                
                if mutation_type == 'ultra_consecutive':
                    # Ultra-aggressive consecutive flow improvement
                    self._ultra_consecutive_mutation(gene, chromosome)
                elif mutation_type == 'smart_consecutive':
                    # Smart consecutive flow improvement
                    self._smart_consecutive_mutation(gene, chromosome)
                else:
                    # Standard mutation with validation
                    original_day = gene.day
                    original_time = gene.time_slot
                    
                    if mutation_type in ['day', 'both']:
                        gene.day = random.choice(WEEKDAYS)
                    
                    if mutation_type in ['time', 'both']:
                        available_slots = get_available_slots(gene.is_lab, gene.day)
                        if available_slots:
                            gene.time_slot = random.choice(available_slots)
                    
                    # Ensure valid assignment
                    if not gene.is_valid_assignment():
                        gene.day = original_day
                        gene.time_slot = original_time
    
    def _ultra_consecutive_mutation(self, gene: Gene, chromosome: Chromosome):
        """ULTRA-AGGRESSIVE: Mutation specifically for consecutive flow optimization"""
        section_key = f"{gene.semester}-{gene.section}"
        section_genes = [g for g in chromosome.genes if f"{g.semester}-{g.section}" == section_key]
        
        # Find the day with most classes for this section
        daily_counts = defaultdict(int)
        for g in section_genes:
            daily_counts[g.day] += 1
        
        if daily_counts:
            # Try to move gene to the day with most classes for better consecutive flow
            best_day = max(daily_counts.keys(), key=lambda d: daily_counts[d])
            
            # Check if this subject is already on that day
            subjects_on_best_day = set(g.subject for g in section_genes if g.day == best_day)
            
            if gene.subject not in subjects_on_best_day:
                # Try to place gene on best day
                same_day_genes = [g for g in section_genes if g.day == best_day and g != gene]
                
                if same_day_genes:
                    # Find slot that creates best consecutive flow
                    existing_slots = [g.time_slot for g in same_day_genes]
                    available_slots = get_available_slots(gene.is_lab, best_day)
                    
                    best_slot = None
                    best_score = -999
                    
                    for slot in available_slots:
                        if slot not in existing_slots:
                            # Calculate consecutive score for this slot
                            score = 0
                            for existing_slot in existing_slots:
                                gap = min(calculate_time_gap(slot, existing_slot),
                                         calculate_time_gap(existing_slot, slot))
                                
                                if gap == CONFIG.PERFECT_GAP_HOURS:
                                    score += 100
                                elif gap <= CONFIG.GOOD_GAP_HOURS:
                                    score += 80
                                elif gap <= CONFIG.ACCEPTABLE_GAP_HOURS:
                                    score += 50
                                elif gap <= CONFIG.MAX_CONSECUTIVE_GAP_HOURS:
                                    score += 20
                                else:
                                    score -= 10
                            
                            if score > best_score:
                                best_score = score
                                best_slot = slot
                    
                    if best_slot and best_score > 0:
                        gene.day = best_day
                        gene.time_slot = best_slot
    
    def _smart_consecutive_mutation(self, gene: Gene, chromosome: Chromosome):
        """Smart mutation to improve consecutive flow"""
        section_key = f"{gene.semester}-{gene.section}"
        section_genes = [g for g in chromosome.genes if f"{g.semester}-{g.section}" == section_key]
        
        # Find genes on same day
        same_day_genes = [g for g in section_genes if g.day == gene.day and g != gene]
        
        if same_day_genes:
            # Try to place this gene consecutively with existing ones
            existing_slots = [g.time_slot for g in same_day_genes]
            available_slots = get_available_slots(gene.is_lab, gene.day)
            
            best_slot = None
            best_gap = float('inf')
            
            for slot in available_slots:
                if slot not in existing_slots:
                    min_gap = min(calculate_time_gap(slot, existing) 
                                for existing in existing_slots)
                    if min_gap < best_gap:
                        best_gap = min_gap
                        best_slot = slot
            
            if best_slot and best_gap <= CONFIG.MAX_CONSECUTIVE_GAP_HOURS:
                gene.time_slot = best_slot

# ============ INTEGRATION FUNCTIONS ============
def prepare_semesters_data(max_semester: int) -> Dict:
    """Enhanced data preparation with validation"""
    semesters_data = {}
    
    logger.info(f"Preparing ULTRA-CONSECUTIVE data for {max_semester} semesters")
    
    for semester in range(1, max_semester + 1):
        sections = Section.objects.filter(semester_number=semester)
        logger.info(f"Found {sections.count()} sections for semester {semester}")
        
        semesters_data[semester] = {}
        
        for section in sections:
            subjects = []
            
            # Get all course types
            core_courses = CoreCourse.objects.filter(semester_number=semester)
            cohort_courses = CohortCourse.objects.filter(semester_number=semester)
            elective_courses = ElectiveCourse.objects.filter(semester_number=semester)
            
            # Add core courses
            for course in core_courses:
                subjects.append({
                    'name': course.course_name,
                    'is_lab': course.is_lab,
                    'duration': course.duration,
                    'type': 'core'
                })
            
            # Add cohort courses
            for course in cohort_courses:
                subjects.append({
                    'name': course.course_name,
                    'is_lab': False,
                    'duration': 75,
                    'type': 'cohort'
                })
            
            # Add elective courses
            for course in elective_courses:
                subjects.append({
                    'name': course.course_name,
                    'is_lab': False,
                    'duration': 75,
                    'type': 'elective'
                })
            
            if subjects:
                semesters_data[semester][section.section_name] = subjects
                logger.info(f"Added {len(subjects)} subjects for section {section.section_name}")
    
    return semesters_data

def chromosome_to_database(chromosome: Chromosome) -> Dict:
    """Enhanced conversion with Friday break marking"""
    # Clear existing schedules
    EnhancedSchedule.objects.all().delete()
    GlobalScheduleMatrix.objects.all().delete()
    
    schedule_data = {}
    processed_global_entries = set()
    
    logger.info(f"Converting ULTRA-CONSECUTIVE chromosome with {len(chromosome.genes)} genes to database")
    
    for gene in chromosome.genes:
        # Save to EnhancedSchedule
        EnhancedSchedule.objects.create(
            semester=gene.semester,
            section=gene.section,
            subject=gene.subject,
            is_lab=gene.is_lab,
            time_slot=gene.time_slot,
            day=gene.day,
            room=gene.room,
            week_number=gene.session_number
        )
        
        # Save to GlobalScheduleMatrix
        global_key = (gene.time_slot, gene.day, gene.room)
        if global_key not in processed_global_entries:
            try:
                GlobalScheduleMatrix.objects.create(
                    time_slot=gene.time_slot,
                    day=gene.day,
                    room_number=gene.room,
                    semester=gene.semester,
                    section=gene.section,
                    subject=gene.subject
                )
                processed_global_entries.add(global_key)
            except Exception as e:
                logger.warning(f"Duplicate GlobalScheduleMatrix entry skipped: {global_key}")
        
        # Prepare display data
        section_key = f'Semester {gene.semester} - {gene.section}'
        if section_key not in schedule_data:
            schedule_data[section_key] = {day: {} for day in WEEKDAYS}
        
        display_time_slot = gene.time_slot.replace('-', ' - ')
        room_info = f" - Room {gene.room}" if gene.room else ""
        class_type = "Lab" if gene.is_lab else "Theory"
        subject_info = f"{gene.subject} ({class_type}){room_info}"
        
        schedule_data[section_key][gene.day][display_time_slot] = subject_info
    
    # Mark Friday break slots
    friday_break_slots = []
    for slot in THEORY_TIME_SLOTS + LAB_TIME_SLOTS:
        if is_friday_break_violation("Friday", slot):
            friday_break_slots.append(slot.replace('-', ' - '))
    
    # Fill empty slots and mark Friday break
    all_display_slots = [slot.replace('-', ' - ') for slot in THEORY_TIME_SLOTS + LAB_TIME_SLOTS]
    
    for section_key in schedule_data:
        for day in WEEKDAYS:
            for slot in all_display_slots:
                if slot not in schedule_data[section_key][day]:
                    if day == "Friday" and slot in friday_break_slots:
                        schedule_data[section_key][day][slot] = "FRIDAY BREAK"
                    else:
                        schedule_data[section_key][day][slot] = "Free"
    
    logger.info(f"Generated ULTRA-CONSECUTIVE schedule_data with {len(schedule_data)} sections")
    return schedule_data

# ============ DJANGO VIEWS ============
def home(request):
    """Ultra-consecutive API-friendly home endpoint"""
    return JsonResponse({
        'status': 'success',
        'message': 'ULTRA-CONSECUTIVE Genetic Algorithm Timetable System API Active',
        'version': '4.0-ULTRA-CONSECUTIVE',
        'algorithm': 'Ultra-Consecutive Genetic Algorithm + Aggressive Optimization',
        'ultra_features': [
            'ULTRA-AGGRESSIVE consecutive class scheduling',
            'Daily compactness optimization',
            'Time block consistency bonuses',
            'Same-course-same-day prevention',
            'Friday break enforcement (12:30-14:00)',
            'Multi-point crossover for pattern preservation',
            'Adaptive consecutive flow mutation'
        ],
        'api_endpoints': {
            'generate': '/api/generate/',
            'ultra_generate': '/api/generate-ultra/',
            'validate': '/api/validate-ultra/',
            'stats': '/api/schedule-stats-ultra/'
        },
        'genetic_config': {
            'population_size': CONFIG.POPULATION_SIZE,
            'generations': CONFIG.GENERATIONS,
            'crossover_rate': CONFIG.CROSSOVER_RATE,
            'mutation_rate': CONFIG.MUTATION_RATE,
            'optimization_level': 'ultra-consecutive'
        }
    })

@csrf_exempt
def generate_ultra_consecutive_timetable(request):
    """Generate timetable using ULTRA-CONSECUTIVE Genetic Algorithm"""
    if request.method == 'POST':
        try:
            # Handle both JSON and form data
            if request.content_type == 'application/json':
                data = json.loads(request.body)
                max_semester = data.get('max_semester', 1)
            else:
                max_semester = int(request.POST.get('max_semester', 1))
            
            logger.info(f"Starting ULTRA-CONSECUTIVE GA timetable generation for {max_semester} semesters")
            
            # Prepare data
            semesters_data = prepare_semesters_data(max_semester)
            
            if not semesters_data or not any(semesters_data.values()):
                return JsonResponse({
                    'status': 'error',
                    'message': 'No course data found. Please upload course data first.',
                    'debug_info': {
                        'semesters_data': semesters_data,
                        'sections_count': Section.objects.count(),
                        'core_courses_count': CoreCourse.objects.count()
                    }
                })
            
            # Initialize and run ultra-consecutive genetic algorithm
            ga = GeneticAlgorithm()
            best_solution = ga.evolve(semesters_data)
            
            # Convert solution to database format
            schedule_data = chromosome_to_database(best_solution)
            
            # Prepare ultra-enhanced response
            response_data = {
                'status': 'success',
                'message': f'ULTRA-CONSECUTIVE Genetic Algorithm timetable generated successfully',
                'schedule': schedule_data,
                'algorithm_info': {
                    'type': 'ULTRA-CONSECUTIVE Genetic Algorithm',
                    'version': '4.0-ULTRA-CONSECUTIVE',
                    'generations': ga.generation + 1,
                    'final_fitness': best_solution.fitness,
                    'consecutive_flow_score': best_solution.consecutive_flow_score,
                    'daily_compactness_score': best_solution.daily_compactness_score,
                    'same_day_violations': best_solution.same_day_violations,
                    'friday_break_violations': best_solution.friday_break_violations,
                    'population_size': ga.config.POPULATION_SIZE,
                    'ultra_enhancements': [
                        'ULTRA-AGGRESSIVE consecutive class flow optimization',
                        'Daily compactness scoring and optimization',
                        'Time block consistency bonuses',
                        'Multi-point crossover for pattern preservation',
                        'Adaptive consecutive flow mutation',
                        'Same-course-same-day prevention',
                        'Friday break enforcement (12:30-14:00)',
                        'Ultra-enhanced selection and genetic operators'
                    ]
                },
                'optimization_metrics': {
                    'consecutive_flow_score': f"{best_solution.consecutive_flow_score:.3f}",
                    'daily_compactness_score': f"{best_solution.daily_compactness_score:.3f}",
                    'same_day_violations': best_solution.same_day_violations,
                    'friday_break_violations': best_solution.friday_break_violations,
                    'total_conflicts': len(best_solution.conflicts),
                    'fitness_score': f"{best_solution.fitness:.2f}"
                },
                'ultra_features': {
                    'ultra_consecutive_classes': True,
                    'daily_compactness_optimization': True,
                    'time_block_consistency': True,
                    'no_same_course_same_day': best_solution.same_day_violations == 0,
                    'friday_break_compliance': best_solution.friday_break_violations == 0,
                    'no_simultaneous_classes': len([c for c in best_solution.conflicts 
                                                  if c['type'] == 'simultaneous_classes']) == 0,
                    'aggressive_flow_optimization': best_solution.consecutive_flow_score > 0.7
                }
            }
            
            if request.content_type == 'application/json':
                return JsonResponse(response_data)
            else:
                request.session['temp_ultra_timetable'] = {
                    'max_semester': max_semester,
                    'data': schedule_data
                }
                return JsonResponse({
                    'status': 'success',
                    'message': 'ULTRA-CONSECUTIVE timetable generated and stored in session',
                    'redirect': '/view/'
                })
                
        except Exception as e:
            logger.error(f"Error in ULTRA-CONSECUTIVE GA generation: {str(e)}", exc_info=True)
            return JsonResponse({
                'status': 'error', 
                'message': f'ULTRA-CONSECUTIVE GA generation failed: {str(e)}'
            })

# ============ COMPATIBILITY AND UTILITY FUNCTIONS ============
def create_timetable(max_semester):
    """ULTRA-CONSECUTIVE compatibility function for api_views.py"""
    logger.info(f"Legacy function called - using ULTRA-CONSECUTIVE GA for {max_semester} semesters")
    
    try:
        semesters_data = prepare_semesters_data(max_semester)
        
        if not semesters_data or not any(semesters_data.values()):
            logger.error("No course data found for ULTRA-CONSECUTIVE genetic algorithm")
            return {}
        
        ga = GeneticAlgorithm()
        best_solution = ga.evolve(semesters_data)
        schedule_data = chromosome_to_database(best_solution)
        
        logger.info(f"ULTRA-CONSECUTIVE GA completed - Fitness: {best_solution.fitness:.2f}, "
                   f"Flow: {best_solution.consecutive_flow_score:.3f}, "
                   f"Compactness: {best_solution.daily_compactness_score:.3f}, "
                   f"Same-day violations: {best_solution.same_day_violations}, "
                   f"Friday violations: {best_solution.friday_break_violations}")
        
        return schedule_data
        
    except Exception as e:
        logger.error(f"Error in ULTRA-CONSECUTIVE create_timetable: {str(e)}")
        return {}

# ============ FILE PROCESSING FUNCTIONS ============
def process_excel_file(excel_file):
    """Enhanced Excel file processing"""
    try:
        xls = pd.ExcelFile(excel_file)
        
        # Process Students and create sections
        if 'Students' in xls.sheet_names:
            students = pd.read_excel(xls, 'Students')
            SemesterStudents.objects.all().delete()
            Section.objects.all().delete()
            
            for _, row in students.iterrows():
                semester = int(row['Semester Number'])
                num_students = int(row['Number of Students'])
                
                SemesterStudents.objects.create(
                    semester_number=semester,
                    number_of_students=num_students
                )
                
                Section.create_sections(semester, num_students)

        # Process Core Courses
        if 'Core Courses' in xls.sheet_names:
            core_courses = pd.read_excel(xls, 'Core Courses')
            CoreCourse.objects.all().delete()
            for _, row in core_courses.iterrows():
                CoreCourse.objects.create(
                    semester_number=int(row['Semester Number']),
                    course_name=str(row['Course Name']),
                    is_lab=str(row['Lab/Theory (Boolean)']).upper() == 'TRUE',
                    duration=150 if str(row['Lab/Theory (Boolean)']).upper() == 'TRUE' else 75
                )

        # Process Cohort Courses
        if 'Cohort Courses' in xls.sheet_names:
            cohort_courses = pd.read_excel(xls, 'Cohort Courses')
            CohortCourse.objects.all().delete()
            for _, row in cohort_courses.iterrows():
                CohortCourse.objects.create(
                    course_name=str(row['Cohort Courses']),
                    semester_number=int(row['Semester Number']),
                    student_range=int(row['STUDENT  RANGE'])
                )

        # Process Elective Courses
        if 'Elective Courses' in xls.sheet_names:
            elective_courses = pd.read_excel(xls, 'Elective Courses')
            ElectiveCourse.objects.all().delete()
            for _, row in elective_courses.iterrows():
                ElectiveCourse.objects.create(
                    semester_number=int(row['Semester Number']),
                    course_name=str(row['Course Name']),
                    is_tech=str(row['TECH/UNI ELE']).upper() == 'TRUE'
                )

        # Process Rooms
        if 'Rooms' in xls.sheet_names:
            rooms = pd.read_excel(xls, 'Rooms')
            Room.objects.all().delete()
            for _, row in rooms.iterrows():
                Room.objects.create(
                    room_number=str(row['Room Number']),
                    core_sub=str(row['Core Sub']).upper() == 'TRUE',
                    cohort_sub=str(row['Cohort Sub']).upper() == 'TRUE',
                    lab=str(row['LAB']).upper() == 'TRUE',
                    dld=str(row['DLD']).upper() == 'TRUE'
                )
        
        return True
    except Exception as e:
        logger.error(f"Error processing Excel file: {str(e)}")
        return False

def process_csv_files(csv_files):
    """CSV processing placeholder"""
    return False

# ============ UTILITY AND VIEW FUNCTIONS ============
def generate_timetable(request):
    """Main timetable generation entry point"""
    if request.method == 'POST':
        form = TimetableGenerationForm(request.POST, request.FILES)
        if form.is_valid():
            max_semester = int(form.cleaned_data['max_semester'])
            
            try:
                file = request.FILES['file']
                
                # Process Excel file
                if file.name.endswith('.xlsx') or file.name.endswith('.xls'):
                    success = process_excel_file(file)
                else:
                    success = process_csv_files([file])
                
                if not success:
                    return JsonResponse({
                        'status': 'error',
                        'message': 'Error processing the uploaded file.'
                    })
                
                # Store data and redirect to ultra-consecutive generation
                request.session['upload_data'] = {
                    'max_semester': max_semester,
                    'file_processed': True
                }
                
                return generate_ultra_web(request, max_semester)
                
            except Exception as e:
                logger.error(f"Error in file processing: {str(e)}", exc_info=True)
                return JsonResponse({
                    'status': 'error', 
                    'message': f'Error: {str(e)}'
                })
    else:
        return JsonResponse({
            'status': 'success',
            'message': 'Upload Excel file to generate ULTRA-CONSECUTIVE timetable',
            'required_sheets': ['Students', 'Core Courses', 'Cohort Courses', 'Elective Courses', 'Rooms'],
            'genetic_algorithm': 'ULTRA-CONSECUTIVE Active'
        })

def generate_ultra_web(request, max_semester=None):
    """Generate ultra-consecutive timetable via web interface"""
    if max_semester is None:
        upload_data = request.session.get('upload_data')
        if not upload_data:
            return JsonResponse({
                'status': 'error',
                'message': 'No upload data found. Please upload file first.'
            })
        max_semester = upload_data['max_semester']
    
    request.method = 'POST'
    request.POST = {'max_semester': max_semester}
    
    return generate_ultra_consecutive_timetable(request)

def save_timetable(request):
    """Enhanced timetable saving"""
    if request.method == 'POST':
        temp_ultra = request.session.get('temp_ultra_timetable')
        
        if temp_ultra:
            timetable = Timetable.objects.create(
                semester=temp_ultra['max_semester'],
                data=temp_ultra['data']
            )
            del request.session['temp_ultra_timetable']
            return JsonResponse({
                'status': 'success',
                'message': 'ULTRA-CONSECUTIVE GA timetable saved successfully!',
                'timetable_id': timetable.id
            })
        else:
            return JsonResponse({
                'status': 'error',
                'message': 'No ULTRA-CONSECUTIVE timetable data found to save.'
            })
    
    return JsonResponse({
        'status': 'error',
        'message': 'Invalid request method'
    })

def view_timetable(request):
    """Enhanced timetable viewing"""
    timetables = Timetable.objects.all().order_by('-created_at')
    
    timetables_data = []
    for timetable in timetables:
        timetables_data.append({
            'id': timetable.id,
            'semester': timetable.semester,
            'created_at': timetable.created_at.isoformat(),
            'data': timetable.data
        })
    
    return JsonResponse({
        'status': 'success',
        'timetables': timetables_data,
        'days': WEEKDAYS,
        'time_slots': [slot.replace('-', ' - ') for slot in THEORY_TIME_SLOTS + LAB_TIME_SLOTS],
        'theory_time_slots': THEORY_TIME_SLOTS,
        'lab_time_slots': LAB_TIME_SLOTS,
        'friday_theory_slots': FRIDAY_THEORY_SLOTS,
        'friday_lab_slots': FRIDAY_LAB_SLOTS,
        'algorithm_type': 'ULTRA-CONSECUTIVE Genetic Algorithm'
    })

def download_timetable_excel(request, timetable_id):
    """Enhanced Excel download"""
    timetable = get_object_or_404(Timetable, id=timetable_id)
    
    wb = Workbook()
    ws = wb.active
    ws.title = f"ULTRA_CONSECUTIVE_GA_Timetable_S1-{timetable.semester}"

    headers = ['Time Slot'] + WEEKDAYS
    for col, header in enumerate(headers, start=1):
        cell = ws.cell(row=1, column=col, value=header)
        cell.font = Font(bold=True)
        cell.fill = PatternFill(start_color="DDDDDD", end_color="DDDDDD", fill_type="solid")

    row = 2
    all_time_slots = [slot.replace('-', ' - ') for slot in THEORY_TIME_SLOTS + LAB_TIME_SLOTS]
    
    for semester_section, schedule in timetable.data.items():
        ws.cell(row=row, column=1, value=f"{semester_section} (ULTRA-CONSECUTIVE GA)").font = Font(bold=True)
        row += 1
        
        for time_slot in all_time_slots:
            ws.cell(row=row, column=1, value=time_slot)
            for col, day in enumerate(WEEKDAYS, start=2):
                cell_value = schedule.get(day, {}).get(time_slot, 'Free')
                ws.cell(row=row, column=col, value=cell_value)
            row += 1
        
        row += 1

    for col in ws.columns:
        max_length = max(len(str(cell.value)) for cell in col)
        ws.column_dimensions[col[0].column_letter].width = max_length + 2

    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = f'attachment; filename=ultra_consecutive_ga_timetable_s1-{timetable.semester}.xlsx'
    wb.save(response)
    
    return response

def delete_timetable(request, timetable_id):
    """Enhanced timetable deletion"""
    timetable = get_object_or_404(Timetable, id=timetable_id)
    timetable.delete()
    return JsonResponse({
        'status': 'success',
        'message': 'ULTRA-CONSECUTIVE timetable deleted successfully!'
    })

# ============ VALIDATION AND STATISTICS ============
@csrf_exempt
def validate_ultra_schedule(request):
    """Ultra-consecutive schedule validation"""
    conflicts = []
    
    # Check section conflicts
    schedules_by_section_time = defaultdict(list)
    for schedule in EnhancedSchedule.objects.all():
        key = f"{schedule.semester}-{schedule.section}-{schedule.day}-{schedule.time_slot}"
        schedules_by_section_time[key].append(schedule)
    
    for key, schedules in schedules_by_section_time.items():
        if len(schedules) > 1:
            conflicts.append({
                'type': 'section_conflict',
                'key': key,
                'count': len(schedules)
            })
    
    # Check same course same day violations
    same_day_violations = 0
    section_daily_subjects = defaultdict(lambda: defaultdict(list))
    for schedule in EnhancedSchedule.objects.all():
        section_key = f"{schedule.semester}-{schedule.section}"
        section_daily_subjects[section_key][schedule.day].append(schedule.subject)
    
    for section_key, daily_schedule in section_daily_subjects.items():
        for day, subjects in daily_schedule.items():
            subject_counts = defaultdict(int)
            for subject in subjects:
                subject_counts[subject] += 1
            for subject, count in subject_counts.items():
                if count > 1:
                    same_day_violations += count - 1
    
    # Check Friday break violations
    friday_break_violations = 0
    for schedule in EnhancedSchedule.objects.filter(day="Friday"):
        if is_friday_break_violation(schedule.day, schedule.time_slot):
            friday_break_violations += 1
    
    # Calculate consecutive flow score
    total_flow_score = 0.0
    section_count = 0
    for section_key in section_daily_subjects.keys():
        # Create mock genes for flow calculation
        mock_genes = []
        for schedule in EnhancedSchedule.objects.filter(
            semester=int(section_key.split('-')[0]),
            section=section_key.split('-')[1]
        ):
            mock_gene = type('MockGene', (), {
                'semester': schedule.semester,
                'section': schedule.section,
                'subject': schedule.subject,
                'day': schedule.day,
                'time_slot': schedule.time_slot
            })()
            mock_genes.append(mock_gene)
        
        if mock_genes:
            flow_score = calculate_ultra_consecutive_flow_score(mock_genes, section_key)
            total_flow_score += flow_score
            section_count += 1
    
    avg_flow_score = total_flow_score / section_count if section_count > 0 else 0.0
    
    return JsonResponse({
        'status': 'success',
        'validation_results': {
            'total_conflicts': len(conflicts),
            'conflicts': conflicts,
            'same_day_violations': same_day_violations,
            'friday_break_violations': friday_break_violations,
            'consecutive_flow_score': f"{avg_flow_score:.3f}",
            'total_schedules': EnhancedSchedule.objects.count(),
            'algorithm_type': 'ULTRA-CONSECUTIVE Genetic Algorithm'
        },
        'is_ultra_quality': (len(conflicts) == 0 and 
                           same_day_violations == 0 and 
                           friday_break_violations == 0 and
                           avg_flow_score > 0.7)
    })

def get_ultra_schedule_statistics(request):
    """Ultra-consecutive schedule statistics"""
    total_schedules = EnhancedSchedule.objects.count()
    theoretical_count = EnhancedSchedule.objects.filter(is_lab=False).count()
    lab_count = EnhancedSchedule.objects.filter(is_lab=True).count()
    
    # Friday break compliance
    friday_schedules = EnhancedSchedule.objects.filter(day="Friday").count()
    friday_break_violations = sum(1 for schedule in EnhancedSchedule.objects.filter(day="Friday")
                                 if is_friday_break_violation(schedule.day, schedule.time_slot))
    
    # Calculate daily compactness
    daily_schedules = defaultdict(list)
    for schedule in EnhancedSchedule.objects.all():
        section_day_key = f"{schedule.semester}-{schedule.section}-{schedule.day}"
        daily_schedules[section_day_key].append(schedule.time_slot)
    
    total_compactness = 0.0
    compactness_count = 0
    for day_key, slots in daily_schedules.items():
        if len(slots) > 1:
            compactness = calculate_daily_compactness_score(slots)
            total_compactness += compactness
            compactness_count += 1
    
    avg_compactness = total_compactness / compactness_count if compactness_count > 0 else 1.0
    
    return JsonResponse({
        'algorithm_type': 'ULTRA-CONSECUTIVE Genetic Algorithm',
        'version': '4.0-ULTRA-CONSECUTIVE',
        'total_schedules': total_schedules,
        'schedule_breakdown': {
            'theoretical_classes': theoretical_count,
            'lab_classes': lab_count
        },
        'friday_analysis': {
            'total_friday_classes': friday_schedules,
            'friday_break_violations': friday_break_violations,
            'friday_break_compliance': friday_break_violations == 0
        },
        'ultra_metrics': {
            'average_daily_compactness': f"{avg_compactness:.3f}",
            'compactness_quality': 'Excellent' if avg_compactness > 0.8 else 'Good' if avg_compactness > 0.6 else 'Fair'
        },
        'ultra_features': [
            'ULTRA-AGGRESSIVE consecutive class flow optimization',
            'Daily compactness scoring and optimization',
            'Time block consistency bonuses',
            'Multi-point crossover for pattern preservation',
            'Adaptive consecutive flow mutation',
            'Same-course-same-day prevention',
            'Friday break enforcement (12:30-14:00)',
            'Ultra-enhanced selection and genetic operators'
        ]
    })


