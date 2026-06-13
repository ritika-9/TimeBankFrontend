import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SessionService } from '../../../core/services/session.service';
import { SkillService } from '../../../core/services/skill.service';
import { Skill } from '../../../core/models/skill.model';

@Component({
  selector: 'app-create-session',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './create-session.component.html',
  styleUrls: ['./create-session.component.css']
})
export class CreateSessionComponent implements OnInit {
  title = '';
  description = '';
  skillId: number | null = null;
  credits: number = 1;
  duration: number = 1;
  skills: Skill[] = [];
  error = '';
  loading = false;
  newSkillName = '';
  showNewSkill = false;

  creditGuide = [
    { range: '1-2 credits', desc: '30 min quick session' },
    { range: '3-4 credits', desc: '1 hour standard session' },
    { range: '5-7 credits', desc: '1.5-2 hour deep dive' },
    { range: '8-10 credits', desc: '2+ hour intensive session' }
  ];

  constructor(
    private sessionService: SessionService,
    private skillService: SkillService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.skillService.getAllSkills().subscribe({
      next: (skills) => this.skills = skills
    });
  }

  addNewSkill(): void {
    if (!this.newSkillName.trim()) return;
    this.skillService.addSkill(this.newSkillName, '').subscribe({
      next: (skill) => {
        this.skills.push(skill);
        this.skillId = skill.id;
        this.newSkillName = '';
        this.showNewSkill = false;
      }
    });
  }

  submit(): void {
    if (!this.title || !this.skillId || !this.credits || !this.duration) {
      this.error = 'Please fill in all required fields';
      return;
    }
    if (this.credits < 1 || this.credits > 10) {
      this.error = 'Credits must be between 1 and 10';
      return;
    }
    this.loading = true;
    this.error = '';
    this.sessionService.createSession({
      title: this.title,
      description: this.description,
      skillId: this.skillId,
      credits: this.credits,
      duration: this.duration
    }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error = err.error?.message || 'Failed to create session';
        this.loading = false;
      }
    });
  }
}