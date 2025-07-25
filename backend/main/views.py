# Enhanced Genetic Algorithm Timetable Generation System

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import (CoreCourse, CohortCourse, ElectiveCourse, Room, SemesterStudents, 
                     Timetable, Section, EnhancedSchedule, GlobalScheduleMatrix, 
                     SubjectFrequencyRule, TimeSlotConfiguration)
from .forms import TimetableGenerationForm
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

logger = logging.getLogger(__name__)

# ============ GENETIC ALGORITHM CONFIGURATION ============

# =====================================================================
# ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ REPLACEMENT CONFIG ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
# =====================================================================
GENETIC_CONFIG = {
    'POPULATION_SIZE': 200,      # Increase population
    'GENERATIONS': 500,          # Give it significantly more time
    'CROSSOVER_RATE': 0.85,
    'MUTATION_RATE': 0.2,
    'ELITE_SIZE': 20,
    'TOURNAMENT_SIZE': 7
}



SUBJECT_FREQUENCY_MAP = {
    # Theoretical subjects - 2 times per week
    "English-I": 2, "Calculus": 2, "Programming Fundamentals": 2,
    "ICT Theory": 2, "Information Security": 2, "Physics": 2,
    "Chemistry": 2, "Mathematics": 2, "Statistics": 2,
    
    # Lab subjects - 1 time per week
    "Programming Fundamentals Lab": 1, "ICT Lab": 1,
    "Physics Lab": 1, "Chemistry Lab": 1,
}

ENHANCED_TIME_SLOTS = [
    "08:00-09:15", "09:30-10:45", "11:00-12:15",  # Morning
    "12:30-13:45", "14:00-15:15", "15:30-16:45",  # Afternoon  
    "17:00-18:15", "18:30-19:45", "20:00-21:15"   # Evening (Extended hours)
]

# =====================================================================
# ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ MAKE THIS CHANGE ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
# =====================================================================
WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
   

def home(request):
    """API-friendly home endpoint - no templates needed"""
    return JsonResponse({
        'status': 'success',
        'message': 'Genetic Algorithm Timetable System API Active',
        'version': '2.0-GA',
        'algorithm': 'Genetic Algorithm + Constraint Satisfaction',
        'backend_features': [
            'Twice-weekly theoretical lectures',
            'Inter-semester conflict resolution', 
            'Extended hours (8 AM - 9 PM)',
            'Multi-objective optimization'
        ],
        'api_endpoints': {
            'generate': '/api/generate/',
            'enhanced_generate': '/api/generate-enhanced/',
            'validate': '/api/validate-enhanced/',
            'stats': '/api/schedule-stats/'
        },
        'genetic_config': {
            'population_size': 50,
            'generations': 100,
            'crossover_rate': 0.8,
            'mutation_rate': 0.1
        }
    })

# ============ GENETIC ALGORITHM CORE CLASSES ============

# =====================================================================
# ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ REPLACE THIS CLASS ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
# =====================================================================
class Gene:
    """Represents a single class session in the timetable."""
    def __init__(self, semester, section, subject, is_lab, session_number=1):
        self.semester = semester
        self.section = section
        self.subject = subject
        self.is_lab = is_lab
        # --- NEW ATTRIBUTE ---
        # Tracks which session this is (e.g., 1st or 2nd lecture of the week)
        self.session_number = session_number
        
        # These are assigned later by the GA
        self.day = None
        self.time_slot = None
        self.room = None

    def __repr__(self):
        return (f"Gene(S{self.semester}-{self.section}, {self.subject}, "
                f"Day={self.day}, Slot={self.time_slot}, Room={self.room})")


class Chromosome:
    """Represents a complete timetable solution"""
    def __init__(self, genes=None):
        self.genes = genes or []
        self.fitness = 0
        self.conflicts = []
        self.schedule_matrix = {}
    def _calculate_scheduling_priority(self, semester, is_lab):
        """
        Calculates a priority score for a class.
        Higher-semester courses and labs get higher priority.
        """
        priority = 0
        # Add a large weight for labs, as they are typically harder to schedule
        if is_lab:
            priority += 100
        
        # Add the semester number to prioritize final-year courses
        priority += semester
        
        return priority
    # =====================================================================
    # ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ END OF NEW METHOD ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
    # =====================================================================
        
    def initialize_random(self, semesters_data):
        """Initialize chromosome with random valid assignments"""
        self.genes = []
        
        for semester, sections_data in semesters_data.items():
            for section_name, subjects in sections_data.items():
                for subject_info in subjects:
                    frequency = get_subject_frequency(subject_info['name'], subject_info['is_lab'])
                    
                    for session in range(frequency):
                        gene = Gene(
                            semester=semester,
                            section=section_name,
                            subject=subject_info['name'],
                            is_lab=subject_info['is_lab']
                        )
                        gene.session_number = session + 1
                        self.genes.append(gene)
        
        # Assign rooms to genes
        self.assign_rooms_to_genes()
        
    def assign_rooms_to_genes(self):
        """Assign appropriate rooms to genes"""
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
                gene.room = "TBD"  # To be determined later
    # This new method goes inside the Chromosome class
    def initialize_sequentially(self, semesters_data):
        """
        Builds an initial timetable by placing each class one by one into the
        first available valid slot, creating a much better starting point.
        """
        self.genes = []
        lab_rooms = [r.room_number for r in Room.objects.filter(lab=True)]
        theory_rooms = [r.room_number for r in Room.objects.filter(core_sub=True)]

        # --- This tracker is now more powerful ---
        # It tracks both room bookings and section bookings
        schedule_tracker = {}

        class_list = []
        for semester, sections_data in semesters_data.items():
            for section_name, subjects in sections_data.items():
                for subject_info in subjects:
                    frequency = get_subject_frequency(subject_info['name'], subject_info['is_lab'])
                    for session in range(frequency):
                        class_list.append({
                            "semester": semester,
                            "section": section_name,
                            "subject": subject_info['name'],
                            "is_lab": subject_info['is_lab'],
                            "session": session,
                            "priority": self._calculate_scheduling_priority(semester, subject_info['is_lab'])
                        })
        
        # Sort by priority: highest priority classes get scheduled first
        class_list.sort(key=lambda x: x['priority'], reverse=True)

        for class_info in class_list:
            gene = Gene(
                semester=class_info['semester'],
                section=class_info['section'],
                subject=class_info['subject'],
                is_lab=class_info['is_lab'],
                session_number=class_info['session'] + 1
            )
            
            # --- This is the part that was failing ---
            available_rooms_for_gene = lab_rooms if gene.is_lab else theory_rooms
            random.shuffle(available_rooms_for_gene) # Add randomness to room choice
            
            best_slot_info = self._find_best_slot(gene, schedule_tracker, available_rooms_for_gene)
            
            if best_slot_info:
                day, time_slot, room = best_slot_info
                gene.day = day
                gene.time_slot = time_slot
                gene.room = room
                
                # Mark both the room and the section as busy at this time
                schedule_tracker[f"{day}-{time_slot}-{room}"] = True
                schedule_tracker[f"{day}-{time_slot}-{gene.section}"] = True
            
            self.genes.append(gene)

    def _calculate_scheduling_priority(self, semester, is_lab):
        """Calculate priority for scheduling (higher = schedule first)"""
        priority = 0
    
        # Labs have higher priority (harder to place)
        if is_lab:
            priority += 100
    
    # Higher semesters have higher priority (fewer students, more flexibility needed)
        priority += semester * 10
    
        return priority

    def _find_best_slot(self, gene_to_schedule, schedule_tracker, available_rooms):
        """
        Finds the first available and valid slot for a given gene.
        Returns (day, time_slot, room) or None if no slot is found.
        """
        # Try to find a completely free slot first
        for room in available_rooms:
            for day in WEEKDAYS:
                for time_slot in ENHANCED_TIME_SLOTS:
                    # Check if the room is free at this time
                    is_room_booked = schedule_tracker.get(f"{day}-{time_slot}-{room}", False)
                    
                    # Check if the section is already busy at this time
                    is_section_busy = schedule_tracker.get(f"{day}-{time_slot}-{gene_to_schedule.section}", False)

                    if not is_room_booked and not is_section_busy:
                        return (day, time_slot, room)
        
        # If no perfectly free slot is found (which is unlikely with enough resources), return None
        return None

    def _find_fallback_slot(self, gene, available_rooms, room_schedule):
        """Find any slot, even if it creates conflicts (better than no assignment)"""
    
    # Just find any room/time combination
        for day in WEEKDAYS[:3]:  # Limit to Mon-Wed to reduce conflicts
            for time_slot in ENHANCED_TIME_SLOTS[:6]:  # Prefer earlier slots
                for room in available_rooms[:10]:  # Try first 10 rooms
                # Assign even if conflict exists
                    return (day, time_slot, room)
    
    # Last resort: use first available room and earliest slot
        if available_rooms and WEEKDAYS and ENHANCED_TIME_SLOTS:
            return (WEEKDAYS[0], ENHANCED_TIME_SLOTS[0], available_rooms[0])
    
        return None

    def _has_section_conflict(self, gene, day, time_slot, room_schedule):
        """Check if this assignment would create a section conflict"""
    
        section_identifier = f"{gene.semester}-{gene.section}"
    
        # Check all rooms for this time slot to see if this section is already scheduled
        for room_name, room_data in room_schedule.items():
            if day in room_data and time_slot in room_data[day]:
                existing_assignment = room_data[day][time_slot]
                if existing_assignment.startswith(section_identifier):
                    return True  # Section conflict found
    
        return False


class GeneticAlgorithm:
    """Main Genetic Algorithm implementation for timetable optimization"""
    
    def __init__(self, config=None):
        self.config = config or GENETIC_CONFIG
        self.population = []
        self.best_chromosome = None
        self.generation = 0
        self.fitness_history = []
        
    # =====================================================================
# ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ REPLACEMENT METHOD ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
# =====================================================================
    def initialize_population(self, semesters_data):
        """Create initial population using the new sequential initializer."""
        logger.info(f"Initializing population of size {self.config['POPULATION_SIZE']} using sequential seeding...")
        
        self.population = []
        for i in range(self.config['POPULATION_SIZE']):
            chromosome = Chromosome()
            # --- THIS IS THE KEY CHANGE ---
            # Instead of random initialization, we build it intelligently.
            chromosome.initialize_sequentially(semesters_data)
            
            # We can add a little bit of mutation to the initial population for diversity
            if i > 0: # Don't mutate the very first one
                self.mutate(chromosome)

            self.population.append(chromosome)
            
        logger.info(f"Created {len(self.population)} chromosomes.")

        
    # =====================================================================
# ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ REPLACEMENT FUNCTION ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
# =====================================================================
   # =====================================================================
# ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ REPLACEMENT 1 of 2 ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
# =====================================================================
    # In backend/main/views.py, replace your evaluate_fitness method:
    def evaluate_fitness(self, chromosome):
        """Evaluate chromosome fitness with proper selection pressure"""
        fitness = 1000  # Start with high fitness
    
    # Hard constraints (major penalties)
        section_conflicts = self.check_section_conflicts(chromosome)
        room_conflicts = self.check_room_conflicts(chromosome)
        inter_semester_conflicts = self.check_inter_semester_conflicts(chromosome)
    
    # Soft constraints (minor penalties)
        daily_load_penalties = self.check_daily_load_balance(chromosome)
        theoretical_frequency_penalties = self.check_theoretical_frequency(chromosome)
        gap_penalties = self.check_time_gaps(chromosome)
    
    # CORRECTED PENALTIES: More gradual and allows negative fitness
        fitness -= len(section_conflicts) * 30      # Reduced penalty
        fitness -= len(room_conflicts) * 40        # Reduced penalty  
        fitness -= len(inter_semester_conflicts) * 20
        fitness -= daily_load_penalties * 5
        fitness -= theoretical_frequency_penalties * 8
        fitness -= gap_penalties * 3
    
    # Bonus for extended hours utilization
        extended_hours_bonus = self.calculate_extended_hours_usage(chromosome)
        fitness += extended_hours_bonus * 10
    
    # CRITICAL FIX: Remove the minimum fitness floor
        chromosome.conflicts = section_conflicts + room_conflicts + inter_semester_conflicts
        chromosome.fitness = fitness  # Allow negative fitness for selection pressure
    
        return chromosome.fitness


        
    def check_section_conflicts(self, chromosome):
        """Check for conflicts within the same section"""
        conflicts = []
        section_schedule = defaultdict(lambda: defaultdict(set))
        
        for gene in chromosome.genes:
            key = f"{gene.semester}-{gene.section}"
            time_key = f"{gene.day}-{gene.time_slot}"
            
            if time_key in section_schedule[key]:
                conflicts.append({
                    'type': 'section_conflict',
                    'section': key,
                    'time': time_key,
                    'subjects': list(section_schedule[key][time_key]) + [gene.subject]
                })
            
            section_schedule[key][time_key].add(gene.subject)
            
        return conflicts
        
    def check_room_conflicts(self, chromosome):
        """Check for room booking conflicts"""
        conflicts = []
        room_schedule = defaultdict(set)
        
        for gene in chromosome.genes:
            if gene.room:
                time_room_key = f"{gene.day}-{gene.time_slot}-{gene.room}"
                
                if time_room_key in room_schedule:
                    conflicts.append({
                        'type': 'room_conflict',
                        'room': gene.room,
                        'time': f"{gene.day}-{gene.time_slot}",
                        'conflicting_classes': list(room_schedule[time_room_key]) + [f"S{gene.semester}-{gene.section}-{gene.subject}"]
                    })
                
                room_schedule[time_room_key].add(f"S{gene.semester}-{gene.section}-{gene.subject}")
                
        return conflicts
        
    def check_inter_semester_conflicts(self, chromosome):
        """Check for conflicts between different semesters"""
        conflicts = []
        time_usage = defaultdict(set)
        
        for gene in chromosome.genes:
            time_key = f"{gene.day}-{gene.time_slot}"
            semester_section = f"S{gene.semester}-{gene.section}"
            
            # Check if different semesters are scheduled at same time without room separation
            if time_key in time_usage:
                existing_semesters = {entry.split('-')[0] for entry in time_usage[time_key]}
                current_semester = f"S{gene.semester}"
                
                if current_semester not in existing_semesters:
                    # Different semesters at same time - check room separation
                    if not self.has_room_separation(chromosome, time_key):
                        conflicts.append({
                            'type': 'inter_semester_conflict',
                            'time': time_key,
                            'semesters': list(existing_semesters) + [current_semester]
                        })
            
            time_usage[time_key].add(semester_section)
            
        return conflicts
        
    def has_room_separation(self, chromosome, time_key):
        """Check if different semesters use different rooms at same time"""
        day, time_slot = time_key.split('-', 1)
        rooms_used = set()
        
        for gene in chromosome.genes:
            if gene.day == day and gene.time_slot == time_slot:
                if gene.room in rooms_used:
                    return False
                rooms_used.add(gene.room)
                
        return True
        
    def check_daily_load_balance(self, chromosome):
        """Check for balanced daily class loads"""
        penalties = 0
        daily_loads = defaultdict(lambda: defaultdict(int))
        
        for gene in chromosome.genes:
            section_key = f"{gene.semester}-{gene.section}"
            daily_loads[section_key][gene.day] += 1
            
        for section, days in daily_loads.items():
            for day, count in days.items():
                if count > 3:  # More than 3 classes per day
                    penalties += count - 3
                    
        return penalties
        
    def check_theoretical_frequency(self, chromosome):
        """Check if theoretical subjects are scheduled twice weekly"""
        penalties = 0
        subject_counts = defaultdict(int)
        
        for gene in chromosome.genes:
            if not gene.is_lab:
                key = f"{gene.semester}-{gene.section}-{gene.subject}"
                subject_counts[key] += 1
                
        for subject_key, count in subject_counts.items():
            expected_frequency = 2  # Theoretical subjects should appear twice
            if count != expected_frequency:
                penalties += abs(count - expected_frequency)
                
        return penalties
        
    # =====================================================================
# ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ REPLACEMENT METHOD ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
# =====================================================================
    def check_time_gaps(self, chromosome):
        """
        Calculates penalties for large time gaps in a section's daily schedule.
        This version safely handles unscheduled genes.
        """
        gap_penalties = 0
        schedule_by_section_day = {}

        # Group all scheduled genes by their section and day
        for gene in chromosome.genes:
            # --- THIS IS THE CRITICAL FIX ---
            # If the gene has no time slot, it's unscheduled. Skip it.
            if gene.time_slot is None:
                continue
            
            key = f"{gene.section}-{gene.day}"
            if key not in schedule_by_section_day:
                schedule_by_section_day[key] = []
            schedule_by_section_day[key].append(gene.time_slot)
        
        # Now, check for gaps in each group
        for key, slots in schedule_by_section_day.items():
            if len(slots) < 2:
                continue # No gaps if there's only one class or none

            # Sort the slots chronologically to measure gaps
            try:
                # Use a proper time object for sorting
                sorted_slots = sorted(slots, key=lambda x: datetime.strptime(x.split('-')[0].strip(), '%H:%M'))
                
                for i in range(len(sorted_slots) - 1):
                    # Get the end time of the current class and the start time of the next
                    end_time_current = datetime.strptime(sorted_slots[i].split('-')[1].strip(), '%H:%M')
                    start_time_next = datetime.strptime(sorted_slots[i+1].split('-')[0].strip(), '%H:%M')
                    
                    gap_minutes = (start_time_next - end_time_current).total_seconds() / 60
                    
                    # Penalize gaps larger than a standard break (e.g., 15 minutes)
                    if gap_minutes > 15:
                        # Add a penalty proportional to the size of the gap
                        gap_penalties += (gap_minutes / 75) # Penalize for each "missed" class slot
            
            except (ValueError, IndexError) as e:
                # This will catch malformed time slot strings, preventing a crash
                logger.warning(f"Could not parse time slots for {key}. Slots: {slots}. Error: {e}")
                continue

        return int(gap_penalties)

        
    def calculate_extended_hours_usage(self, chromosome):
        """Calculate bonus for using extended hours (evening slots)"""
        extended_slots = ["17:00-18:15", "18:30-19:45", "20:00-21:15"]
        extended_usage = 0
        
        for gene in chromosome.genes:
            if gene.time_slot in extended_slots:
                extended_usage += 1
                
        return extended_usage
        
    def selection(self):
        """Tournament selection for choosing parents"""
        selected = []
        
        for _ in range(self.config['POPULATION_SIZE']):
            # Tournament selection
            tournament = random.sample(self.population, min(self.config['TOURNAMENT_SIZE'], len(self.population)))
            winner = max(tournament, key=lambda x: x.fitness)
            selected.append(winner)
            
        return selected
        
    def crossover(self, parent1, parent2):
        """Crossover operation to create offspring"""
        if random.random() > self.config['CROSSOVER_RATE']:
            return parent1, parent2
            
        # Single-point crossover
        crossover_point = random.randint(1, min(len(parent1.genes), len(parent2.genes)) - 1)
        
        child1 = Chromosome()
        child2 = Chromosome()
        
        child1.genes = parent1.genes[:crossover_point] + parent2.genes[crossover_point:]
        child2.genes = parent2.genes[:crossover_point] + parent1.genes[crossover_point:]
        
        return child1, child2
        
    def mutate(self, chromosome):
    
        for i in range(len(chromosome.genes)):
            if random.random() < self.config['MUTATION_RATE']:
                gene = chromosome.genes[i]
            
            # Check if this gene is involved in a conflict
                is_conflicted = False
                for conflict in chromosome.conflicts:
                    if hasattr(conflict, 'get') and gene.subject in str(conflict):
                        is_conflicted = True
                        break
            
                if is_conflicted:
                # Try to find a better slot for conflicted genes
                    attempts = 0
                    while attempts < 10:  # Limit attempts to avoid infinite loops
                        new_day = random.choice(WEEKDAYS)
                        new_time = random.choice(ENHANCED_TIME_SLOTS)
                    
                    # Simple conflict check
                        slot_conflicts = sum(1 for other_gene in chromosome.genes 
                                             if other_gene != gene and 
                                                other_gene.day == new_day and 
                                                other_gene.time_slot == new_time and 
                                                other_gene.room == gene.room)
                    
                        if slot_conflicts == 0:  # Found a free slot
                            gene.day = new_day
                            gene.time_slot = new_time
                            break
                        attempts += 1
                else:
                # Random mutation for non-conflicted genes
                    if random.choice([True, False]):
                        gene.day = random.choice(WEEKDAYS)
                    else:
                        gene.time_slot = random.choice(ENHANCED_TIME_SLOTS)

    def evolve(self, semesters_data):
        """Main evolution loop"""
        logger.info(f"Starting evolution with {self.config['GENERATIONS']} generations")
        
        # Initialize population
        self.initialize_population(semesters_data)
        
        # Evaluate initial population
        for chromosome in self.population:
            self.evaluate_fitness(chromosome)
            
        for generation in range(self.config['GENERATIONS']):
            self.generation = generation
            
            # Sort population by fitness
            self.population.sort(key=lambda x: x.fitness, reverse=True)
            
            # Track best chromosome
            if not self.best_chromosome or self.population[0].fitness > self.best_chromosome.fitness:
                self.best_chromosome = self.population[0]
                
            # Log progress
            if generation % 10 == 0:
                best_fitness = self.population[0].fitness
                avg_fitness = sum(c.fitness for c in self.population) / len(self.population)
                logger.info(f"Generation {generation}: Best={best_fitness:.2f}, Avg={avg_fitness:.2f}, Conflicts={len(self.best_chromosome.conflicts)}")
                
            self.fitness_history.append(self.population[0].fitness)
            
            # Create next generation
            new_population = []
            
            # Keep elite individuals
            elite_size = min(self.config['ELITE_SIZE'], len(self.population))
            new_population.extend(self.population[:elite_size])
            
            # Generate offspring
            while len(new_population) < self.config['POPULATION_SIZE']:
                # Selection
                parents = self.selection()
                parent1, parent2 = random.sample(parents, 2)
                
                # Crossover
                child1, child2 = self.crossover(parent1, parent2)
                
                # Mutation
                self.mutate(child1)
                self.mutate(child2)
                
                # Evaluate offspring
                self.evaluate_fitness(child1)
                self.evaluate_fitness(child2)
                
                new_population.extend([child1, child2])
                
            # Replace population
            self.population = new_population[:self.config['POPULATION_SIZE']]
            
            # Early termination if perfect solution found
            if self.best_chromosome.fitness >= 1000 and len(self.best_chromosome.conflicts) == 0:
                logger.info(f"Perfect solution found at generation {generation}")
                break
                
        logger.info(f"Evolution completed. Best fitness: {self.best_chromosome.fitness}, Conflicts: {len(self.best_chromosome.conflicts)}")
        return self.best_chromosome

# ============ INTEGRATION FUNCTIONS ============

def get_subject_frequency(subject_name, is_lab):
    """Get frequency based on subject type"""
    if is_lab:
        return 1
    return SUBJECT_FREQUENCY_MAP.get(subject_name, 2)

def prepare_semesters_data(max_semester):
    """Prepare data structure for genetic algorithm"""
    semesters_data = {}
    
    for semester in range(1, max_semester + 1):
        sections = Section.objects.filter(semester_number=semester)
        semesters_data[semester] = {}
        
        for section in sections:
            subjects = []
            core_courses = CoreCourse.objects.filter(semester_number=semester)
            
            for course in core_courses:
                subjects.append({
                    'name': course.course_name,
                    'is_lab': course.is_lab,
                    'duration': course.duration
                })
                
            semesters_data[semester][section.section_name] = subjects
            
    return semesters_data

# =====================================================================
# ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ REPLACEMENT FUNCTION ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
# =====================================================================
def chromosome_to_database(chromosome):
    """
    Convert chromosome to database records, now with a robust method for
    handling and flagging room conflicts without crashing.
    """
    # Clear existing schedules for a fresh start
    EnhancedSchedule.objects.all().delete()
    GlobalScheduleMatrix.objects.all().delete()
    
    schedule_data = {}
    
    for gene in chromosome.genes:
        # --- Prepare the data structures for display ---
        section_key = f'Semester {gene.semester} - {gene.section}'
        if section_key not in schedule_data:
            schedule_data[section_key] = {day: {slot: None for slot in ENHANCED_TIME_SLOTS} for day in WEEKDAYS}
        
        # --- PRE-SAVE VALIDATION FOR ROOM CONFLICTS ---
        is_slot_taken = GlobalScheduleMatrix.objects.filter(
            time_slot=gene.time_slot,
            day=gene.day,
            room_number=gene.room
        ).exists()

        if is_slot_taken:
            # --- CONFLICT HANDLING LOGIC ---
            # 1. Create a special "conflict room" name to flag the issue.
            conflict_room_name = f"CONFLICT-{gene.room}"
            
            # 2. Log a clear warning for the administrator/developer.
            logger.warning(
                f"Room Conflict: Room {gene.room} is already booked on {gene.day} "
                f"at {gene.time_slot}. Flagging {gene.subject} with a conflict room."
            )
            
            # 3. Save the class to the main schedule but with the conflict flag.
            EnhancedSchedule.objects.create(
                semester=gene.semester,
                section=gene.section,
                subject=gene.subject,
                is_lab=gene.is_lab,
                time_slot=gene.time_slot,
                day=gene.day,
                room=conflict_room_name,  # Use the special conflict name
                week_number=gene.session_number
            )
            
            # 4. Update the display data to show the conflict clearly.
            subject_info = f"{gene.subject} ({'Lab' if gene.is_lab else 'Theory'}) - ROOM CONFLICT"
            schedule_data[section_key][gene.day][gene.time_slot] = subject_info

            # 5. CRITICAL: Do NOT save to GlobalScheduleMatrix to avoid the UNIQUE constraint error.

        else:
            # --- NORMAL, CONFLICT-FREE LOGIC ---
            # Save to the main schedule
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
            
            # Save to the matrix that enforces unique bookings
            GlobalScheduleMatrix.objects.create(
                time_slot=gene.time_slot,
                day=gene.day,
                room_number=gene.room,
                semester=gene.semester,
                section=gene.section,
                subject=gene.subject
            )
            
            # Update display data normally
            room_info = f" - Room {gene.room}" if gene.room else ""
            subject_info = f"{gene.subject} ({'Lab' if gene.is_lab else 'Theory'}){room_info}"
            schedule_data[section_key][gene.day][gene.time_slot] = subject_info
    
    return schedule_data


# ============ DJANGO VIEWS ============

@csrf_exempt
def generate_enhanced_timetable(request):
    """Generate timetable using Genetic Algorithm"""
    if request.method == 'POST':
        try:
            # Handle both JSON and form data
            if request.content_type == 'application/json':
                data = json.loads(request.body)
                max_semester = data.get('max_semester', 1)
            else:
                max_semester = int(request.POST.get('max_semester', 1))
            
            logger.info(f"Starting Genetic Algorithm timetable generation for {max_semester} semesters")
            
            # Prepare data for genetic algorithm
            semesters_data = prepare_semesters_data(max_semester)
            
            # Initialize and run genetic algorithm
            ga = GeneticAlgorithm()
            best_solution = ga.evolve(semesters_data)
            
            # Convert solution to database format
            schedule_data = chromosome_to_database(best_solution)
            
            # Prepare response
            response_data = {
                'status': 'success',
                'message': f'Genetic Algorithm timetable generated successfully',
                'schedule': schedule_data,
                'algorithm_info': {
                    'type': 'Genetic Algorithm + Constraint Satisfaction',
                    'generations': ga.generation + 1,
                    'final_fitness': best_solution.fitness,
                    'conflicts': len(best_solution.conflicts),
                    'population_size': ga.config['POPULATION_SIZE']
                },
                'features': {
                    'theoretical_twice_weekly': True,
                    'inter_semester_conflict_free': len(best_solution.conflicts) == 0,
                    'extended_hours': True,
                    'genetic_optimization': True
                }
            }
            
            if request.content_type == 'application/json':
                return JsonResponse(response_data)
            else:
                request.session['temp_enhanced_timetable'] = {
                    'max_semester': max_semester,
                    'data': schedule_data
                }
                # Return JSON instead of template for web interface too
                return JsonResponse({
                    'status': 'success',
                    'message': 'Timetable generated and stored in session',
                    'redirect': '/view/'
                })
                
        except Exception as e:
            logger.error(f"Error in genetic algorithm timetable generation: {str(e)}", exc_info=True)
            error_msg = f'Genetic Algorithm generation failed: {str(e)}'
            
            return JsonResponse({'status': 'error', 'message': error_msg})

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
                
                # Store data and redirect to genetic algorithm generation
                request.session['upload_data'] = {
                    'max_semester': max_semester,
                    'file_processed': True
                }
                
                # Generate using genetic algorithm
                return generate_enhanced_web(request, max_semester)
                
            except Exception as e:
                logger.error(f"Error in file processing: {str(e)}", exc_info=True)
                return JsonResponse({
                    'status': 'error', 
                    'message': f'Error: {str(e)}'
                })
    else:
        # Return form data as JSON for API compatibility
        return JsonResponse({
            'status': 'success',
            'message': 'Upload Excel file to generate timetable',
            'required_sheets': ['Students', 'Core Courses', 'Cohort Courses', 'Elective Courses', 'Rooms'],
            'genetic_algorithm': 'Active'
        })

def generate_enhanced_web(request, max_semester=None):
    """Generate genetic algorithm timetable via web interface"""
    if max_semester is None:
        upload_data = request.session.get('upload_data')
        if not upload_data:
            return JsonResponse({
                'status': 'error',
                'message': 'No upload data found. Please upload file first.'
            })
        max_semester = upload_data['max_semester']
    
    # Create fake POST request for genetic algorithm
    request.method = 'POST'
    request.POST = {'max_semester': max_semester}
    
    return generate_enhanced_timetable(request)
def _pick(df, *variants, required=True):
    """
    Return the *first* column name present in ``df`` out of the supplied
    ``variants`` list.
    If nothing matches and *required* is True we raise KeyError.
    """
    for v in variants:
        if v in df.columns:
            return v
    if required:
        raise KeyError(f"None of the columns {variants} found in sheet.")
    return None


def _to_bool(val):
    """
    Convert many possible truthy / falsy formats to Python bool.
    Accepts: True/False, 'TRUE'/'FALSE', 'yes'/'no', 1/0, 1.0/0.0
    """
    if isinstance(val, bool):
        return val
    if val is None or (isinstance(val, float) and pd.isna(val)):
        return False
    s = str(val).strip().lower()
    return s in ("1", "true", "t", "yes", "y")

# ============ FILE PROCESSING FUNCTIONS ============

# =====================================================================
# ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ REPLACEMENT FUNCTION ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
# =====================================================================
def process_excel_file(excel_file):
    """
    Accepts an uploaded Excel file from the API and populates Django tables,
    robustly handling different header spellings and 'nil' values.
    """
    try:
        xls = pd.ExcelFile(excel_file)

        # --- Process Students ---
        if "StudentCapacity" in xls.sheet_names or "Students" in xls.sheet_names:
            sheet_name = "StudentCapacity" if "StudentCapacity" in xls.sheet_names else "Students"
            students = pd.read_excel(xls, sheet_name)
            SemesterStudents.objects.all().delete()
            Section.objects.all().delete()
            sem_col = _pick(students, "Semester Number", "semester", "Semester", "Sem")
            pop_col = _pick(students, "Number of Students", "student_count", "Student Count", "Headcount")
            for _, row in students.iterrows():
                semester = to_int_or_zero(row[sem_col])
                num_students = to_int_or_zero(row[pop_col])
                if semester > 0:
                    SemesterStudents.objects.create(semester_number=semester, number_of_students=num_students)
                    Section.create_sections(semester, num_students)

        # --- Process Core Courses (from Roadmap sheet) ---
        if "Roadmap" in xls.sheet_names or "Core Courses" in xls.sheet_names:
            sheet_name = "Roadmap" if "Roadmap" in xls.sheet_names else "Core Courses"
            courses = pd.read_excel(xls, sheet_name)
            CoreCourse.objects.all().delete()
            sem_col = _pick(courses, "Semester Number", "semester", "Semester")
            name_col = _pick(courses, "Course Name", "course_name", "Course")
            lab_col = _pick(courses, "Lab/Theory (Boolean)", "is_lab", "Lab", "lab")
            for _, row in courses.iterrows():
                semester = to_int_or_zero(row[sem_col])
                if semester > 0:
                    is_lab_flag = _to_bool(row[lab_col])
                    CoreCourse.objects.create(
                        semester_number=semester,
                        course_name=str(row[name_col]),
                        is_lab=is_lab_flag,
                        duration=150 if is_lab_flag else 75
                    )

        # --- Process Rooms ---
        if "Rooms" in xls.sheet_names:
            rooms = pd.read_excel(xls, "Rooms")
            Room.objects.all().delete()
            num_col = _pick(rooms, "Room Number", "room_number", "Room", "room_name")
            type_col = _pick(rooms, "Room Type", "room_type", "Type", required=False)
            for _, row in rooms.iterrows():
                room_name = str(row[num_col]).strip()
                if room_name and room_name.lower() != 'nan':
                    r_type = str(row.get(type_col, "")).lower()
                    Room.objects.create(
                        room_number=room_name,
                        core_sub=r_type in ("theory", "lecture", "core"),
                        lab=r_type == "lab"
                    )
        
        # Also ensure the helper functions _pick and _to_bool exist above this function
        return True

    except KeyError as e:
        logger.error(f"Required column not found during API upload: {e}")
        return False
    except Exception as e:
        logger.error(f"Error processing API-uploaded Excel file: {str(e)}", exc_info=True)
        return False

# You also need to add this helper function if it's not already there
def to_int_or_zero(value):
    """
    Safely converts a value to an integer. If the value is invalid
    (like 'nil', empty, or NaN), it returns 0.
    """
    try:
        if pd.isna(value): return 0
        return int(float(value))
    except (ValueError, TypeError):
        return 0


def process_csv_files(csv_files):
    return False

# ============ UTILITY FUNCTIONS ============

# =====================================================================
# ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ REPLACEMENT 2 of 2 ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
# =====================================================================
@csrf_exempt # This is crucial for APIs called from a separate frontend
def save_timetable(request):
    """
    API endpoint to save a timetable. It now expects the timetable data
    in the POST request body, not in the session.
    """
    if request.method == 'POST':
        try:
            # Load the data directly from the request body
            data = json.loads(request.body)
            
            # Extract the schedule data and semester number
            schedule_data = data.get('schedule')
            max_semester = data.get('max_semester')

            if not schedule_data or not max_semester:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Missing "schedule" or "max_semester" in request body.'
                }, status=400)

            # Create the timetable object in the database
            timetable = Timetable.objects.create(
                semester=max_semester,
                data=schedule_data
            )
            
            logger.info(f"Timetable saved successfully with ID: {timetable.id}")
            return JsonResponse({
                'status': 'success',
                'message': 'Genetic Algorithm timetable saved successfully!',
                'timetable_id': timetable.id
            })

        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON format in request body.'}, status=400)
        except Exception as e:
            logger.error(f"Error saving timetable: {str(e)}", exc_info=True)
            return JsonResponse({'status': 'error', 'message': 'An internal error occurred.'}, status=500)
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request method. Use POST.'}, status=405)


def view_timetable(request):
    timetables = Timetable.objects.all().order_by('-created_at')
    
    # Convert timetables to JSON-friendly format
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
        'time_slots': [slot.replace('-', ' - ') for slot in ENHANCED_TIME_SLOTS],
        'enhanced_time_slots': ENHANCED_TIME_SLOTS,
    })

def download_timetable_excel(request, timetable_id):
    timetable = get_object_or_404(Timetable, id=timetable_id)
    
    wb = Workbook()
    ws = wb.active
    ws.title = f"GA_Timetable_Semesters_1-{timetable.semester}"

    headers = ['Time Slot'] + WEEKDAYS
    for col, header in enumerate(headers, start=1):
        cell = ws.cell(row=1, column=col, value=header)
        cell.font = Font(bold=True)
        cell.fill = PatternFill(start_color="DDDDDD", end_color="DDDDDD", fill_type="solid")

    row = 2
    all_time_slots = [slot.replace('-', ' - ') for slot in ENHANCED_TIME_SLOTS]
    
    for semester_section, schedule in timetable.data.items():
        ws.cell(row=row, column=1, value=f"{semester_section} (Genetic Algorithm)").font = Font(bold=True)
        row += 1
        
        for time_slot in all_time_slots:
            ws.cell(row=row, column=1, value=time_slot)
            for col, day in enumerate(WEEKDAYS, start=2):
                cell_value = schedule.get(day, {}).get(time_slot.replace(' - ', '-'), '-')
                ws.cell(row=row, column=col, value=cell_value)
            row += 1
        
        row += 1

    for col in ws.columns:
        max_length = max(len(str(cell.value)) for cell in col)
        ws.column_dimensions[col[0].column_letter].width = max_length + 2

    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = f'attachment; filename=genetic_algorithm_timetable_semesters_1-{timetable.semester}.xlsx'
    wb.save(response)
    
    return response

def delete_timetable(request, timetable_id):
    timetable = get_object_or_404(Timetable, id=timetable_id)
    timetable.delete()
    return JsonResponse({
        'status': 'success',
        'message': 'Timetable deleted successfully!'
    })

# ============ VALIDATION AND STATISTICS ============

@csrf_exempt
def validate_enhanced_schedule(request):
    """Validate the genetic algorithm generated schedule"""
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
    
    # Check room conflicts
    room_bookings = defaultdict(list)
    for matrix in GlobalScheduleMatrix.objects.all():
        key = f"{matrix.day}-{matrix.time_slot}-{matrix.room_number}"
        room_bookings[key].append(matrix)
    
    for key, bookings in room_bookings.items():
        if len(bookings) > 1:
            conflicts.append({
                'type': 'room_conflict',
                'key': key,
                'count': len(bookings)
            })
    
    # Check theoretical subjects frequency
    theoretical_counts = defaultdict(int)
    for schedule in EnhancedSchedule.objects.filter(is_lab=False):
        key = f"{schedule.semester}-{schedule.section}-{schedule.subject}"
        theoretical_counts[key] += 1
    
    twice_weekly_subjects = sum(1 for count in theoretical_counts.values() if count == 2)
    incorrect_frequency = sum(1 for count in theoretical_counts.values() if count != 2)
    
    return JsonResponse({
        'status': 'success',
        'validation_results': {
            'total_conflicts': len(conflicts),
            'conflicts': conflicts,
            'theoretical_subjects_correct_frequency': twice_weekly_subjects,
            'theoretical_subjects_incorrect_frequency': incorrect_frequency,
            'total_schedules': EnhancedSchedule.objects.count(),
            'algorithm_type': 'Genetic Algorithm + CSP'
        },
        'is_valid': len(conflicts) == 0 and incorrect_frequency == 0
    })

def get_schedule_statistics(request):
    """Get detailed statistics about the genetic algorithm generated schedule"""
    total_schedules = EnhancedSchedule.objects.count()
    theoretical_count = EnhancedSchedule.objects.filter(is_lab=False).count()
    lab_count = EnhancedSchedule.objects.filter(is_lab=True).count()
    
    # Calculate theoretical frequency distribution
    theoretical_subjects = defaultdict(int)
    for schedule in EnhancedSchedule.objects.filter(is_lab=False):
        key = f"{schedule.semester}-{schedule.section}-{schedule.subject}"
        theoretical_subjects[key] += 1
    
    frequency_distribution = {
        'once_weekly': sum(1 for count in theoretical_subjects.values() if count == 1),
        'twice_weekly': sum(1 for count in theoretical_subjects.values() if count == 2),
        'more_than_twice': sum(1 for count in theoretical_subjects.values() if count > 2)
    }
    
    # Time slot usage
    time_slot_usage = {}
    for slot in ENHANCED_TIME_SLOTS:
        count = EnhancedSchedule.objects.filter(time_slot=slot).count()
        time_slot_usage[slot] = count
    
    # Extended hours usage
    extended_slots = ["17:00-18:15", "18:30-19:45", "20:00-21:15"]
    extended_usage = sum(time_slot_usage.get(slot, 0) for slot in extended_slots)
    total_usage = sum(time_slot_usage.values())
    extended_percentage = (extended_usage / total_usage * 100) if total_usage > 0 else 0
    
    return JsonResponse({
        'algorithm_type': 'Genetic Algorithm + Constraint Satisfaction Problem',
        'total_schedules': total_schedules,
        'schedule_breakdown': {
            'theoretical_classes': theoretical_count,
            'lab_classes': lab_count
        },
        'theoretical_frequency_distribution': frequency_distribution,
        'time_slot_usage': time_slot_usage,
        'extended_hours_utilization': {
            'count': extended_usage,
            'percentage': round(extended_percentage, 2)
        },
        'optimization_features': [
            'Multi-objective fitness function',
            'Tournament selection',
            'Single-point crossover',
            'Random mutation',
            'Elite preservation',
            'Constraint satisfaction integration'
        ]
    })

# ============ COMPATIBILITY FUNCTIONS FOR API_VIEWS ============

def create_timetable(max_semester):
    """Compatibility function for api_views.py - uses Genetic Algorithm"""
    logger.info(f"Legacy create_timetable called - redirecting to Genetic Algorithm for {max_semester} semesters")
    
    try:
        # Prepare data for genetic algorithm
        semesters_data = prepare_semesters_data(max_semester)
        
        # Initialize and run genetic algorithm
        ga = GeneticAlgorithm()
        best_solution = ga.evolve(semesters_data)
        
        # Convert solution to database format
        schedule_data = chromosome_to_database(best_solution)
        
        logger.info(f"Genetic Algorithm completed - Fitness: {best_solution.fitness}, Conflicts: {len(best_solution.conflicts)}")
        return schedule_data
        
    except Exception as e:
        logger.error(f"Error in legacy create_timetable: {str(e)}")
        # Return empty structure if genetic algorithm fails
        return {}
