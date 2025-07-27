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
import uuid # Add this import at the top of your file if it's not there


logger = logging.getLogger(__name__)

# ============ GENETIC ALGORITHM CONFIGURATION ============
# In backend/main/views.py

# ============ GENETIC ALGORITHM CONFIGURATION ============
GENETIC_CONFIG = {
    'POPULATION_SIZE': 200,
    'GENERATIONS': 100,
    'CROSSOVER_RATE': 0.85,
    'MUTATION_RATE': 0.4,  # INCREASED from 0.2 to 0.4 for more exploration
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
# In backend/main/views.py
# Add this function right after the SUBJECT_FREQUENCY_MAP definition

def get_subject_frequency(subject_name, is_lab):
    """Get frequency based on subject type and name"""
    if is_lab:
        return 1  # Labs are typically once per week
    # For theory subjects, check the map or default to 2 times per week
    return SUBJECT_FREQUENCY_MAP.get(subject_name, 2)


ENHANCED_TIME_SLOTS = [
"08:00-09:15", "09:30-10:45", "11:00-12:15", # Morning
"12:30-13:45", "14:00-15:15", "15:30-16:45", # Afternoon
"17:00-18:15", "18:30-19:45", "20:00-21:15" # Evening (Extended hours)
]
# Lab time slots (165 minutes each - 2h 45m)
LAB_TIME_SLOTS = [
    "08:00-10:45", "11:00-13:45", "14:00-16:45", "17:00-19:45"
]
# Add this right after LAB_TIME_SLOTS definition (around line 94)
THEORY_TIME_SLOTS = [
    "08:00-09:15", "09:30-10:45", "11:00-12:15", 
    "12:30-13:45", "14:00-15:15", "15:30-16:45", 
    "17:00-18:15", "18:30-19:45", "20:00-21:15"
]

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
class Gene:
    """Represents a single class session in the timetable, now with a unique ID."""
    def __init__(self, semester, section, subject, is_lab, session_number=1):
        self.id = uuid.uuid4() # Assign a unique identifier to every gene instance
        self.semester = semester
        self.section = section
        self.subject = subject
        self.is_lab = is_lab
        self.session_number = session_number
        self.day = None
        self.time_slot = None
        self.room = None

    def __repr__(self):
        room_name = self.room.room_number if self.room else "None"
        return (f"Gene(S{self.semester}-{self.section}, {self.subject}, "
                f"Day={self.day}, Slot={self.time_slot}, Room={room_name})")
    
    # Add hash and eq methods to allow Gene objects to be added to a set
    def __hash__(self):
        return hash(self.id)

    def __eq__(self, other):
        return isinstance(other, Gene) and self.id == other.id


# =====================================================================
# REVISED AND IMPROVED Chromosome CLASS
# Replace the old Chromosome class in views.py with this one.
# =====================================================================
class Chromosome:
    """Represents a complete timetable solution"""
    def __init__(self, genes=None):
        self.genes = genes or []
        self.fitness = 0
        self.conflicts = []
        # The schedule_matrix is no longer needed here, it's handled during database save
        
    def _calculate_scheduling_priority(self, semester, is_lab):
        """Calculates a priority score for a class. Higher is more critical."""
        priority = 0
        if is_lab:
            priority += 100 # Labs are high priority due to limited rooms
        priority += semester # Higher semesters are higher priority
        return priority

    def initialize_sequentially(self, semesters_data):
        """
        Builds an initial timetable by placing each class one by one into the
        first available valid slot, using a SHUFFLED search to ensure better distribution.
        """
        self.genes = []
        # Fetch all Room OBJECTS once
        all_lab_rooms = list(Room.objects.filter(lab=True))
        all_theory_rooms = list(Room.objects.filter(core_sub=True))
        
        # Check if rooms exist
        if not all_lab_rooms or not all_theory_rooms:
            logger.error("CRITICAL: No lab rooms or theory rooms found in the database. Cannot generate a schedule.")
            return # Stop initialization if there are no rooms

        schedule_tracker = {} # Tracks [day-slot-room] and [day-slot-section] bookings
        class_list = []

        # Create a master list of all class sessions to be scheduled
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
        
        # Sort the list so high-priority classes are placed first
        class_list.sort(key=lambda x: x['priority'], reverse=True)

        for class_info in class_list:
            gene = Gene(
                semester=class_info['semester'],
                section=class_info['section'],
                subject=class_info['subject'],
                is_lab=class_info['is_lab'],
                session_number=class_info['session'] + 1
            )
            
            # Select the correct pool of rooms for this gene
            available_rooms_for_gene = all_lab_rooms if gene.is_lab else all_theory_rooms
            
            best_slot_info = self._find_best_slot_shuffled(gene, schedule_tracker, available_rooms_for_gene)
            
            if best_slot_info:
                day, time_slot, room_obj = best_slot_info
                gene.day = day
                gene.time_slot = time_slot
                gene.room = room_obj # Assign the found room OBJECT
                
                # --- THE FIX IS HERE ---
                # Create a unique key for the section to avoid semester collision.
                unique_section_key = f"S{gene.semester}-{gene.section}"
                
                # Mark both the room and the UNIQUE section as busy for this slot
                schedule_tracker[f"{day}-{time_slot}-{room_obj.room_number}"] = True
                schedule_tracker[f"{day}-{time_slot}-{unique_section_key}"] = True # Use the unique key
                self.genes.append(gene)
            else:
                logger.warning(f"No conflict-free slot found for {gene.subject} ({gene.section}). Using fallback assignment.")
                fallback_slot = self._find_fallback_slot(gene, available_rooms_for_gene)
                if fallback_slot:
                    day, time_slot, room_obj = fallback_slot
                    gene.day = day
                    gene.time_slot = time_slot
                    gene.room = room_obj
                    self.genes.append(gene)
                else:
                    logger.error(f"CRITICAL FAILURE: Could not assign any slot for {gene.subject}. It will be missing from the schedule. Check if you have rooms of the required type (Lab/Theory).")

    def _find_best_slot_shuffled(self, gene_to_schedule, schedule_tracker, available_rooms):
        shuffled_rooms = random.sample(available_rooms, len(available_rooms))
        shuffled_days = random.sample(WEEKDAYS, len(WEEKDAYS))
    
    # Use appropriate time slots based on whether it's a lab or theory class
        if gene_to_schedule.is_lab:
            shuffled_slots = random.sample(LAB_TIME_SLOTS, len(LAB_TIME_SLOTS))
        else:
            shuffled_slots = random.sample(THEORY_TIME_SLOTS, len(THEORY_TIME_SLOTS))

        for room_obj in shuffled_rooms:
            for day in shuffled_days:
                for time_slot in shuffled_slots:
                    section_key = f"S{gene_to_schedule.semester}-{gene_to_schedule.section}-{day}-{time_slot}"
                    room_key = f"R{room_obj.id}-{day}-{time_slot}"
                    if not schedule_tracker.get(room_key) and not schedule_tracker.get(section_key):
                        return (day, time_slot, room_obj)
        return None


    def _find_fallback_slot(self, gene, available_rooms):
        if available_rooms and WEEKDAYS:
            day = random.choice(WEEKDAYS)
            if gene.is_lab:
                time_slot = random.choice(LAB_TIME_SLOTS)
            else:
                time_slot = random.choice(THEORY_TIME_SLOTS)
        room = random.choice(available_rooms)
        return (day, time_slot, room)
        return None



# =====================================================================
# REVISED AND IMPROVED GeneticAlgorithm CLASS
# Replace the old GeneticAlgorithm class in views.py with this one.
# =====================================================================
# =====================================================================
# THE DEFINITIVE, COMPLETE GeneticAlgorithm CLASS
# Replace the entire existing GeneticAlgorithm class in views.py with this.
# This version contains all necessary methods and will resolve the crash.
# =====================================================================
# =====================================================================
# THE DEFINITIVE, COMPLETE GeneticAlgorithm CLASS
# Replace the entire existing GeneticAlgorithm class in views.py with this.
# This version contains all necessary methods and will resolve the crash.
# =====================================================================
class GeneticAlgorithm:
    """
    Final, robust Genetic Algorithm implementation.
    Features perfectly synchronized conflict detection and advanced mutation operators
    to escape local optima and solve complex scheduling constraints.
    """
    def __init__(self, config=None):
        self.config = config or GENETIC_CONFIG
        self.population = []
        self.best_chromosome = None
        self.generation = 0
        # Tracks fitness to detect stagnation
        self.stagnation_counter = 0
        self.last_best_fitness = -float('inf')

    def initialize_population(self, semesters_data):
        logger.info(f"Initializing population of size {self.config['POPULATION_SIZE']}...")
        self.population = []
        for i in range(self.config['POPULATION_SIZE']):
            chromosome = Chromosome()
            chromosome.initialize_sequentially(semesters_data)
            self.population.append(chromosome)
        logger.info("Population initialized.")

    def evaluate_fitness(self, chromosome):
        """Calculates fitness based on both hard and soft constraints."""
        fitness = 1000
        
        conflicting_genes = self.get_all_hard_conflicts(chromosome)
        num_conflicts = len(conflicting_genes)

        # Apply a very heavy penalty for any hard conflicts
        fitness -= num_conflicts * 500 
        
        # Also apply penalties for soft constraints
        daily_load_penalties = self.check_daily_load_balance(chromosome)
        gap_penalties = self.check_time_gaps(chromosome)
        theoretical_frequency_penalties = self.check_theoretical_frequency(chromosome)

        fitness -= daily_load_penalties * 5
        fitness -= gap_penalties * 3
        fitness -= theoretical_frequency_penalties * 10
        
        chromosome.conflicts = list(conflicting_genes)
        chromosome.fitness = fitness
        return fitness

    def get_all_hard_conflicts(self, chromosome):
        """
        THE DEFINITIVE CONFLICT CHECKER.
        Uses separate trackers for rooms and sections to be 100% aligned with the database.
        """
        conflicts = set()
        room_tracker = {}  # Key: room_slot, Value: Gene
        section_tracker = {} # Key: section_slot, Value: Gene

        for gene in chromosome.genes:
            if not all([gene.day, gene.time_slot, gene.room]):
                conflicts.add(gene)
                continue

            section_slot_key = f"S{gene.semester}-{gene.section}-{gene.day}-{gene.time_slot}"
            room_slot_key = f"R{gene.room.id}-{gene.day}-{gene.time_slot}"

            if section_slot_key in section_tracker:
                conflicts.add(gene)
                conflicts.add(section_tracker[section_slot_key])
            else:
                section_tracker[section_slot_key] = gene

            if room_slot_key in room_tracker:
                conflicts.add(gene)
                conflicts.add(room_tracker[room_slot_key])
            else:
                room_tracker[room_slot_key] = gene
                
        return conflicts

    # --- MISSING HELPER METHODS NOW INCLUDED ---
    def check_daily_load_balance(self, chromosome):
        penalties = 0
        daily_loads = defaultdict(lambda: defaultdict(int))
        for gene in chromosome.genes:
            if not gene.day: continue
            section_key = f"S{gene.semester}-{gene.section}"
            daily_loads[section_key][gene.day] += 1
        for section, days in daily_loads.items():
            for day, count in days.items():
                if count > 4: # Penalize more than 4 classes a day
                    penalties += (count - 4)
        return penalties

    def check_time_gaps(self, chromosome):
        gap_penalties = 0
        schedule_by_section_day = defaultdict(list)
        for gene in chromosome.genes:
            if not gene.time_slot or not gene.day: continue
            key = f"S{gene.semester}-{gene.section}-{gene.day}"
            schedule_by_section_day[key].append(gene.time_slot)
        
        for key, slots in schedule_by_section_day.items():
            if len(slots) < 2: continue
            try:
                sorted_slots = sorted(slots, key=lambda x: datetime.strptime(x.split('-')[0].strip(), '%H:%M'))
                for i in range(len(sorted_slots) - 1):
                    end_time_current = datetime.strptime(sorted_slots[i].split('-')[1].strip(), '%H:%M')
                    start_time_next = datetime.strptime(sorted_slots[i+1].split('-')[0].strip(), '%H:%M')
                    gap_minutes = (start_time_next - end_time_current).total_seconds() / 60
                    if gap_minutes > 15: # Penalize gaps larger than 15 mins
                        gap_penalties += (gap_minutes / 75)
            except (ValueError, IndexError):
                continue
        return int(gap_penalties)
    
    def check_theoretical_frequency(self, chromosome):
        penalties = 0
        subject_counts = defaultdict(int)
        for gene in chromosome.genes:
            if not gene.is_lab:
                key = f"S{gene.semester}-{gene.section}-{gene.subject}"
                subject_counts[key] += 1
        
        for subject_key, count in subject_counts.items():
            # Dynamically get expected frequency
            parts = subject_key.split('-')
            subject_name = parts[-1]
            expected_freq = get_subject_frequency(subject_name, is_lab=False)
            if count != expected_freq:
                penalties += abs(count - expected_freq)
        return penalties

    # --- MUTATION OPERATORS ---
    def mutate(self, chromosome):
        """Main mutation function with stagnation-aware logic."""
        if self.stagnation_counter > 10 and random.random() < 0.2:
            self.partial_scramble_mutate(chromosome)
            return

        if chromosome.conflicts and random.random() < 0.9:
            self.repair_mutate(chromosome)
        
        elif random.random() < 0.5:
            self.swap_mutate(chromosome)

        if random.random() < self.config['MUTATION_RATE']:
            self.random_mutate(chromosome)

    def partial_scramble_mutate(self, chromosome):
        """A 'bigger hammer' mutation for escaping local optima."""
        if not chromosome.conflicts: return
        
        conflicting_section_gene = random.choice(list(chromosome.conflicts))
        target_semester = conflicting_section_gene.semester
        target_section = conflicting_section_gene.section
        
        logger.info(f"Stagnation detected. Scrambling schedule for S{target_semester}-{target_section}...")

        genes_to_reschedule = [g for g in chromosome.genes if g.semester == target_semester and g.section == target_section]
        other_genes = [g for g in chromosome.genes if not (g.semester == target_semester and g.section == target_section)]
        
        schedule_tracker = {}
        for g in other_genes:
            if g.day and g.time_slot:
                unique_section_key = f"S{g.semester}-{g.section}-{g.day}-{g.time_slot}"
                if g.room: schedule_tracker[f"R{g.room.id}-{g.day}-{g.time_slot}"] = True
                schedule_tracker[unique_section_key] = True

        for gene in genes_to_reschedule:
            available_rooms = list(Room.objects.filter(lab=gene.is_lab))
            new_slot_info = self._find_best_slot_shuffled(gene, schedule_tracker, available_rooms)
            if new_slot_info:
                day, time_slot, room_obj = new_slot_info
                gene.day, gene.time_slot, gene.room = day, time_slot, room_obj
                schedule_tracker[f"R{room_obj.id}-{day}-{time_slot}"] = True
                unique_section_key = f"S{gene.semester}-{gene.section}-{day}-{time_slot}"
                schedule_tracker[unique_section_key] = True

    def _find_best_slot_shuffled(self, gene_to_schedule, schedule_tracker, available_rooms):
        shuffled_rooms = random.sample(available_rooms, len(available_rooms))
        shuffled_days = random.sample(WEEKDAYS, len(WEEKDAYS))
        # WRONG (around line 463) - needs to be updated:
        shuffled_slots = random.sample(ENHANCED_TIME_SLOTS, len(ENHANCED_TIME_SLOTS))

# Should be:
        if gene_to_schedule.is_lab:
            shuffled_slots = random.sample(LAB_TIME_SLOTS, len(LAB_TIME_SLOTS))
        else:
            shuffled_slots = random.sample(THEORY_TIME_SLOTS, len(THEORY_TIME_SLOTS))

        for room_obj in shuffled_rooms:
            for day in shuffled_days:
                for time_slot in shuffled_slots:
                    section_key = f"S{gene_to_schedule.semester}-{gene_to_schedule.section}-{day}-{time_slot}"
                    room_key = f"R{room_obj.id}-{day}-{time_slot}"
                    if not schedule_tracker.get(room_key) and not schedule_tracker.get(section_key):
                        return (day, time_slot, room_obj)
        return None
    
    def repair_mutate(self, chromosome):
        if not chromosome.conflicts: return
        gene_to_fix = random.choice(list(chromosome.conflicts))
        
        schedule_tracker = {}
        for g in chromosome.genes:
            if g is gene_to_fix: continue
            if g.day and g.time_slot:
                unique_section_key = f"S{g.semester}-{g.section}-{g.day}-{g.time_slot}"
                if g.room: schedule_tracker[f"R{g.room.id}-{g.day}-{g.time_slot}"] = True
                schedule_tracker[unique_section_key] = True

        available_rooms = list(Room.objects.filter(lab=gene_to_fix.is_lab))
        if not available_rooms: return
        new_slot_info = self._find_best_slot_shuffled(gene_to_fix, schedule_tracker, available_rooms)
        if new_slot_info:
            gene_to_fix.day, gene_to_fix.time_slot, gene_to_fix.room = new_slot_info

    def swap_mutate(self, chromosome):
        if len(chromosome.genes) < 2: return
        idx1, idx2 = random.sample(range(len(chromosome.genes)), 2)
        gene1, gene2 = chromosome.genes[idx1], chromosome.genes[idx2]
        gene1.day, gene2.day = gene2.day, gene1.day
        gene1.time_slot, gene2.time_slot = gene2.time_slot, gene1.time_slot
        gene1.room, gene2.room = gene2.room, gene1.room

    def random_mutate(self, chromosome):
        if not chromosome.genes: return
        gene_to_mutate = random.choice(chromosome.genes)
    
        gene_to_mutate.day = random.choice(WEEKDAYS)
    
    # Assign appropriate time slot based on class type
        if gene_to_mutate.is_lab:
            gene_to_mutate.time_slot = random.choice(LAB_TIME_SLOTS)
        else:
            gene_to_mutate.time_slot = random.choice(THEORY_TIME_SLOTS)
    
        room_pool = Room.objects.filter(lab=gene_to_mutate.is_lab)
        if room_pool.exists(): 
            gene_to_mutate.room = random.choice(list(room_pool))



    # --- CORE EVOLUTIONARY LOOP ---
    def selection(self):
        tournament = random.sample(self.population, self.config['TOURNAMENT_SIZE'])
        return max(tournament, key=lambda c: c.fitness)

    def crossover(self, parent1, parent2):
        if random.random() > self.config['CROSSOVER_RATE'] or len(parent1.genes) <= 1:
            return Chromosome(parent1.genes[:]), Chromosome(parent2.genes[:])
        crossover_point = random.randint(1, len(parent1.genes) - 1)
        child1_genes = parent1.genes[:crossover_point] + parent2.genes[crossover_point:]
        child2_genes = parent2.genes[:crossover_point] + parent1.genes[crossover_point:]
        return Chromosome(child1_genes), Chromosome(child2_genes)

    def evolve(self, semesters_data):
        self.initialize_population(semesters_data)
        for chromosome in self.population:
            self.evaluate_fitness(chromosome)

        for generation in range(self.config['GENERATIONS']):
            self.generation = generation
            self.population.sort(key=lambda c: c.fitness, reverse=True)

            current_best = self.population[0]
            if not self.best_chromosome or current_best.fitness > self.best_chromosome.fitness:
                self.best_chromosome = current_best
                if self.best_chromosome.fitness > self.last_best_fitness:
                    self.last_best_fitness = self.best_chromosome.fitness
                    self.stagnation_counter = 0
                else:
                    self.stagnation_counter += 1
            else:
                self.stagnation_counter += 1

            if generation % 10 == 0:
                logger.info(f"Generation {generation}: Best Fitness={self.best_chromosome.fitness:.2f}, Conflicts={len(self.best_chromosome.conflicts)}, Stagnation={self.stagnation_counter}")

            if len(self.best_chromosome.conflicts) == 0:
                logger.info(f"Optimal solution found at generation {generation}.")
                break
            
            new_population = self.population[:self.config['ELITE_SIZE']]
            
            while len(new_population) < self.config['POPULATION_SIZE']:
                parent1 = self.selection()
                parent2 = self.selection()
                child1, child2 = self.crossover(parent1, parent2)
                self.mutate(child1)
                self.mutate(child2)
                self.evaluate_fitness(child1)
                self.evaluate_fitness(child2)
                new_population.extend([child1, child2])

            self.population = new_population

        logger.info(f"Evolution finished. Best fitness: {self.best_chromosome.fitness}, Final Conflicts: {len(self.best_chromosome.conflicts)}")
        return self.best_chromosome



# =====================================================================
# MODIFICATION 3: Complete replacement of chromosome_to_database
# This new function is robust and handles Room objects correctly.
# =====================================================================
def chromosome_to_database(chromosome):
    """
    Convert chromosome to database records, with robust validation to prevent crashes.
    """
    # Clear previous schedule data
    EnhancedSchedule.objects.all().delete()
    GlobalScheduleMatrix.objects.all().delete()
    
    schedule_data_for_json = {}
    
    for gene in chromosome.genes:
        # --- Pre-save Validation ---
        if not all([gene.day, gene.time_slot, gene.room]):
            logger.error(f"CRITICAL: Skipping save for '{gene.subject}' due to incomplete data. "
                         f"Day: {gene.day}, Time: {gene.time_slot}, Room: {gene.room}")
            continue

        # Check that gene.room is a Room object
        if not isinstance(gene.room, Room):
            logger.error(f"CRITICAL: Skipping save for '{gene.subject}'. The assigned room is not a valid Room object.")
            continue
            
        # Check for conflicts in the GlobalScheduleMatrix before saving
        is_slot_taken = GlobalScheduleMatrix.objects.filter(
            day=gene.day,
            time_slot=gene.time_slot,
            room_number=gene.room.room_number # Use room_number for the check
        ).exists()

        if is_slot_taken:
            # If the GA produced a solution with a conflict, log it but DO NOT save it to the DB.
            # This prevents the program from crashing on a UNIQUE constraint.
            logger.warning(
                f"Conflict Detected by Save Function: Room {gene.room.room_number} is already booked "
                f"on {gene.day} at {gene.time_slot}. The class '{gene.subject}' for section {gene.section} "
                "was NOT saved to the database. The GA fitness function needs improvement."
            )
            continue # Skip to the next gene

        # --- If all checks pass, save the record ---
        try:
            # Save to the main schedule table
            EnhancedSchedule.objects.create(
                semester=gene.semester,
                section=gene.section,
                subject=gene.subject,
                is_lab=gene.is_lab,
                time_slot=gene.time_slot,
                day=gene.day,
                room=gene.room,  # Pass the entire Room object here
                week_number=gene.session_number
            )

            # Save to the global matrix to enforce uniqueness for subsequent checks
            GlobalScheduleMatrix.objects.create(
                time_slot=gene.time_slot,
                day=gene.day,
                room_number=gene.room.room_number,
                semester=gene.semester,
                section=gene.section,
                subject=gene.subject
            )

            # Prepare the data for the JSON response to the frontend
            section_key = f'Semester {gene.semester} - {gene.section}'
            if section_key not in schedule_data_for_json:
                all_time_slots = THEORY_TIME_SLOTS + LAB_TIME_SLOTS
                schedule_data_for_json[section_key] = {day: {slot: None for slot in all_time_slots} for day in WEEKDAYS}
            
            subject_info = f"{gene.subject} ({'Lab' if gene.is_lab else 'Theory'}) - Room {gene.room.room_number}"
            schedule_data_for_json[section_key][gene.day][gene.time_slot] = subject_info

        except Exception as e:
            logger.error(f"Failed to save gene to database: {gene}. Error: {e}", exc_info=True)

    return schedule_data_for_json
# In backend/main/views.py

# =====================================================================
# ADD THIS MISSING FUNCTION BACK INTO YOUR FILE
# Place it right before the `generate_enhanced_timetable` function.
# =====================================================================
# In backend/main/views.py

# Ensure this function from the previous step is present and correctly indented
def prepare_semesters_data(max_semester):
    """Prepare data structure for the genetic algorithm by querying the database."""
    semesters_data = {}
    for semester in range(1, max_semester + 1):
        sections = Section.objects.filter(semester_number=semester)
        if not sections.exists():
            continue
            
        semesters_data[semester] = {}
        # Get all courses for the semester once to be efficient
        core_courses = CoreCourse.objects.filter(semester_number=semester)
        
        for section in sections:
            subjects = []
            for course in core_courses:
                subjects.append({
                    'name': course.course_name,
                    'is_lab': course.is_lab,
                    'duration': course.duration
                })
            semesters_data[semester][section.section_name] = subjects
            
    return semesters_data

# =====================================================================
# REPLACE your existing 'generate_enhanced_timetable' with this complete version.
# This version has the try...except block correctly structured.
# =====================================================================
@csrf_exempt
def generate_enhanced_timetable(request):
    """Generate timetable using Genetic Algorithm"""
    if request.method == 'POST':
        try:
            # Handle both JSON and form data
            if request.content_type == 'application/json':
                data = json.loads(request.body)
                max_semester = data.get('max_semester', 8)
            else:
                max_semester = int(request.POST.get('max_semester', 8))

            logger.info(f"Starting Genetic Algorithm timetable generation for {max_semester} semesters")
            
            # Prepare data using the function above
            semesters_data = prepare_semesters_data(max_semester)
            if not semesters_data:
                logger.warning("No semester data found for the given range. Aborting generation.")
                return JsonResponse({'status': 'error', 'message': 'No courses or sections found for the specified semesters.'}, status=404)

            # Run the Genetic Algorithm
            ga = GeneticAlgorithm()
            best_solution = ga.evolve(semesters_data)
            
            # Persist and format the final solution
            schedule_data = chromosome_to_database(best_solution)

            # Prepare the final successful response
            response_data = {
                'status': 'success',
                'message': 'Genetic Algorithm timetable generated successfully',
                'schedule': schedule_data,
                'algorithm_info': {
                    'generations': ga.generation,
                    'final_fitness': best_solution.fitness,
                    'conflicts': len(best_solution.conflicts),
                }
            }
            return JsonResponse(response_data)

        except Exception as e:
            # This is the 'except' block that was missing or broken
            logger.error(f"Error in genetic algorithm timetable generation: {str(e)}", exc_info=True)
            return JsonResponse({'status': 'error', 'message': f'An unexpected error occurred: {str(e)}'}, status=500)
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)



# ============ DJANGO VIEWS ============
@csrf_exempt
def generate_enhanced_timetable(request):
    """Generate timetable using Genetic Algorithm"""
    if request.method == 'POST':
        try:
            # Handle both JSON and form data
            if request.content_type == 'application/json':
                data = json.loads(request.body)
                max_semester = data.get('max_semester', 8)
            else:
                max_semester = int(request.POST.get('max_semester', 8))

            logger.info(f"Starting Genetic Algorithm timetable generation for {max_semester} semesters")
            
            # Prepare data
            semesters_data = prepare_semesters_data(max_semester)
            
            # Run GA
            ga = GeneticAlgorithm()
            best_solution = ga.evolve(semesters_data)
            
            # Persist and format solution
            schedule_data = chromosome_to_database(best_solution)

            # Prepare response
            response_data = {
                'status': 'success',
                'message': 'Genetic Algorithm timetable generated successfully',
                'schedule': schedule_data,
                'algorithm_info': {
                    'generations': ga.generation,
                    'final_fitness': best_solution.fitness,
                    'conflicts': len(best_solution.conflicts),
                }
            }
            return JsonResponse(response_data)

        except Exception as e:
            logger.error(f"Error in genetic algorithm timetable generation: {str(e)}", exc_info=True)
            return JsonResponse({'status': 'error', 'message': f'GA generation failed: {str(e)}'}, status=500)
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

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
    for v in variants:
        if v in df.columns:
            return v
    if required:
        raise KeyError(f"None of the columns {variants} found in sheet.")
    return None


def _to_bool(val):
    if isinstance(val, bool): return val
    if val is None or (isinstance(val, float) and pd.isna(val)): return False
    s = str(val).strip().lower()
    return s in ("1", "true", "t", "yes", "y")

# ============ FILE PROCESSING FUNCTIONS ============

# =====================================================================
# ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ REPLACEMENT FUNCTION ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
# =====================================================================
def process_excel_file(excel_file):
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
        return True
    except KeyError as e:
        logger.error(f"Required column not found during API upload: {e}")
        return False
    except Exception as e:
        logger.error(f"Error processing API-uploaded Excel file: {str(e)}", exc_info=True)
        return False

# You also need to add this helper function if it's not already there
def to_int_or_zero(value):
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
def save_timetable(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            schedule_data = data.get('schedule')
            max_semester = data.get('max_semester')

            if not schedule_data or not max_semester:
                return JsonResponse({'status': 'error', 'message': 'Missing "schedule" or "max_semester".'}, status=400)
            
            timetable = Timetable.objects.create(
                semester=max_semester,
                data=schedule_data
            )
            logger.info(f"Timetable saved with ID: {timetable.id}")
            return JsonResponse({'status': 'success', 'message': 'Timetable saved successfully!', 'timetable_id': timetable.id})
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON.'}, status=400)
        except Exception as e:
            logger.error(f"Error saving timetable: {e}", exc_info=True)
            return JsonResponse({'status': 'error', 'message': 'Internal error.'}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Use POST.'}, status=405)


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
    combined_slots = THEORY_TIME_SLOTS + LAB_TIME_SLOTS
    all_time_slots = [slot.replace('-', ' - ') for slot in combined_slots]    
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
    all_slots = THEORY_TIME_SLOTS + LAB_TIME_SLOTS
    for slot in all_slots:
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
