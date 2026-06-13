import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { UserService } from '../../core/services/user.service';
import { SkillService } from '../../core/services/skill.service';
import { User } from '../../core/models/user.model';
import { Skill } from '../../core/models/skill.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  allSkills: Skill[] = [];
  selectedOfferedSkills: number[] = [];
  selectedNeededSkills: number[] = [];
  bio = '';
  availability = '';
  editing = false;
  error = '';
  success = '';
  loading = false;

  days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  times = ['MORNING', 'AFTERNOON', 'EVENING'];
  selectedDays: string[] = [];
  selectedTimes: string[] = [];

  constructor(
    private userService: UserService,
    private skillService: SkillService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.skillService.getAllSkills().subscribe({
      next: (skills) => this.allSkills = skills
    });
  }

  loadProfile(): void {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.bio = user.bio || '';
        if (user.availability) {
          const parts = user.availability.split('|');
          this.selectedDays = parts[0] ? parts[0].split(',') : [];
          this.selectedTimes = parts[1] ? parts[1].split(',') : [];
        }
      }
    });
  }

  toggleDay(day: string): void {
    const idx = this.selectedDays.indexOf(day);
    if (idx > -1) this.selectedDays.splice(idx, 1);
    else this.selectedDays.push(day);
  }

  toggleTime(time: string): void {
    const idx = this.selectedTimes.indexOf(time);
    if (idx > -1) this.selectedTimes.splice(idx, 1);
    else this.selectedTimes.push(time);
  }

  isDaySelected(day: string): boolean {
    return this.selectedDays.includes(day);
  }

  isTimeSelected(time: string): boolean {
    return this.selectedTimes.includes(time);
  }

  toggleSkillOffered(skillId: number): void {
    const idx = this.selectedOfferedSkills.indexOf(skillId);
    if (idx > -1) this.selectedOfferedSkills.splice(idx, 1);
    else this.selectedOfferedSkills.push(skillId);
  }

  toggleSkillNeeded(skillId: number): void {
    const idx = this.selectedNeededSkills.indexOf(skillId);
    if (idx > -1) this.selectedNeededSkills.splice(idx, 1);
    else this.selectedNeededSkills.push(skillId);
  }

  saveProfile(): void {
    this.loading = true;
    this.error = '';
    const availability = `${this.selectedDays.join(',')}|${this.selectedTimes.join(',')}`;
    this.userService.updateProfile({
      bio: this.bio,
      availability,
      skillsOffered: this.selectedOfferedSkills as any,
      skillsNeeded: this.selectedNeededSkills as any
    }).subscribe({
      next: (user) => {
        this.user = user;
        this.success = 'Profile updated successfully!';
        this.editing = false;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to update profile';
        this.loading = false;
      }
    });
  }

  get completionPercent(): number {
    if (!this.user) return 0;
    let score = 0;
    if (this.user.name) score += 20;
    if (this.user.bio) score += 20;
    if (this.user.availability) score += 20;
    if (this.user.skillsOffered?.length > 0) score += 20;
    if (this.user.skillsNeeded?.length > 0) score += 20;
    return score;
  }
}