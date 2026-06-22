import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { RequestService } from '../../../core/services/request.service';
import { SkillService } from '../../../core/services/skill.service';
import { Skill } from '../../../core/models/skill.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-request',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.css']
})
export class CreateRequestComponent implements OnInit {
  title = '';
  description = '';
  skillId: number | null = null;
  hoursRequired: number | null = null;
  newSkillName = '';
  skills: Skill[] = [];
  error = '';
  success = '';
  loading = false;
  showNewSkill = false;
  generatingDesc = false;

  constructor(
    private requestService: RequestService,
    private skillService: SkillService,
    private router: Router,
    private http: HttpClient
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
    if (!this.title || !this.skillId || !this.hoursRequired) {
      this.error = 'Please fill in all required fields';
      return;
    }
    this.loading = true;
    this.error = '';
    this.requestService.createRequest({
      title: this.title,
      description: this.description,
      skillId: this.skillId,
      hoursRequired: this.hoursRequired
    }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error = err.error?.message || 'Failed to create request';
        this.loading = false;
      }
    });
  }

  generateDescription(): void {
  if (!this.title) {
    this.error = 'Enter a title first';
    return;
  }
  this.generatingDesc = true;
  this.http.post<any>('http://localhost:8080/api/ai/generate-description', {
    title: this.title,
    skillName: this.skills.find(s => s.id === this.skillId)?.name || ''
  }).subscribe({
    next: (res) => {
      this.description = res.description;
      this.generatingDesc = false;
    },
    error: () => this.generatingDesc = false
  });
}
}