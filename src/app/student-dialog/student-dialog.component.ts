import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface Student {
  Roll_No: string;
  Name: string;
  Section: string;
  Attendance: number;
  Monthly_Mark: number;
  Parent_Name: string;
  Parent_Email: string;
}

export interface DialogData {
  mode: 'add' | 'edit' | 'view';
  student?: Student;
}

@Component({
  selector: 'app-student-dialog',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="dialog-wrapper">
      <!-- Popup Header -->
      <header class="dialog-header">
        <div class="header-title">
          <span class="mode-badge" [ngClass]="data.mode">
            <mat-icon>{{
              data.mode === 'view' ? 'visibility' : data.mode === 'edit' ? 'edit' : 'person_add'
            }}</mat-icon>
            {{ data.mode | uppercase }} MODE
          </span>
          <h2>
            {{
              data.mode === 'view'
                ? 'Student Profile Overview'
                : data.mode === 'edit'
                  ? 'Edit Profile Details'
                  : 'Create New Profile'
            }}
          </h2>
        </div>

        <button mat-icon-button class="close-btn" mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </header>

      <!-- Form Section -->
      <mat-dialog-content class="dialog-body">
        <form [formGroup]="studentForm" class="form-grid">
          <!-- Roll Number -->
          <div class="form-group">
            <label class="custom-label">Roll Number</label>
            <mat-form-field appearance="outline" class="full-width">
              <input matInput formControlName="Roll_No" placeholder="e.g. 2026-CS-101" />
              <mat-error *ngIf="studentForm.get('Roll_No')?.hasError('required')"
                >Roll No is required</mat-error
              >
            </mat-form-field>
          </div>

          <!-- Full Name -->
          <div class="form-group">
            <label class="custom-label">Full Name</label>
            <mat-form-field appearance="outline" class="full-width">
              <input matInput formControlName="Name" placeholder="e.g. Name" required />
              <mat-error *ngIf="studentForm.get('Name')?.hasError('required')"
                >Name is required</mat-error
              >
            </mat-form-field>
          </div>

          <!-- Section -->
          <div class="form-group">
            <label class="custom-label">Section</label>
            <mat-form-field appearance="outline" class="full-width">
              <mat-select formControlName="Section" placeholder="Select Section">
                <mat-option value="A">Section A</mat-option>
                <mat-option value="B">Section B</mat-option>
                <mat-option value="C">Section C</mat-option>
              </mat-select>
              <mat-error *ngIf="studentForm.get('Section')?.hasError('required')"
                >Section is required</mat-error
              >
            </mat-form-field>
          </div>

          <!-- Attendance Score -->
          <div class="form-group">
            <label class="custom-label">Attendance Score (%)</label>
            <mat-form-field appearance="outline" class="full-width">
              <input matInput type="number" formControlName="Attendance" placeholder="e.g. 95" />
              <mat-error *ngIf="studentForm.get('Attendance')?.invalid"
                >Attendance score (0-100) required</mat-error
              >
            </mat-form-field>
          </div>

          <!-- Monthly Mark -->
          <div class="form-group">
            <label class="custom-label">Monthly Mark Score</label>
            <mat-form-field appearance="outline" class="full-width">
              <input matInput type="number" formControlName="Monthly_Mark" placeholder="e.g. 88" />
              <mat-error *ngIf="studentForm.get('Monthly_Mark')?.invalid"
                >Valid mark (0-100) required</mat-error
              >
            </mat-form-field>
          </div>

          <!-- Parent Name -->
          <div class="form-group">
            <label class="custom-label">Parent / Guardian Name</label>
            <mat-form-field appearance="outline" class="full-width">
              <input matInput formControlName="Parent_Name" placeholder="e.g. Name" required />
              <mat-error *ngIf="studentForm.get('Parent_Name')?.hasError('required')"
                >Parent Name is required</mat-error
              >
            </mat-form-field>
          </div>

          <!-- Parent Email -->
          <div class="form-group span-2">
            <label class="custom-label">Parent Email Address</label>
            <mat-form-field appearance="outline" class="full-width">
              <input
                matInput
                type="email"
                formControlName="Parent_Email"
                placeholder="parent@gmail.com"
              />
              <mat-error *ngIf="studentForm.get('Parent_Email')?.hasError('email')"
                >Enter a valid email address</mat-error
              >
            </mat-form-field>
          </div>
        </form>
      </mat-dialog-content>

      <!-- Popup Footer Actions -->
      <footer class="dialog-footer">
        <button class="btn-cancel" type="button" mat-dialog-close>Cancel</button>

        <button
          *ngIf="data.mode !== 'view'"
          type="button"
          class="btn-save"
          [disabled]="studentForm.invalid"
          (click)="onSave()"
        >
          <mat-icon>check_circle</mat-icon>
          <span>{{ data.mode === 'add' ? 'Create Record' : 'Save Changes' }}</span>
        </button>
      </footer>
    </div>
  `,
  styles: [
    `
      ::ng-deep .mat-icon {
        height: 30px !important;
        width: 23px !important;
      }
      .dialog-wrapper {
        padding: 28px;
        background-color: #ffffff;
        color: #0f172a;
        border-radius: 16px;
        box-shadow:
          0 20px 25px -5px rgba(0, 0, 0, 0.1),
          0 8px 10px -6px rgba(0, 0, 0, 0.1);
      }

      /* Header Styling */
      .dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 24px;
      }

      .header-title h2 {
        margin: 8px 0 0 0;
        font-size: 20px;
        font-weight: 800;
        letter-spacing: -0.3px;
        color: #0f172a;
      }

      .mode-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        font-weight: 800;
        padding: 4px 10px;
        border-radius: 20px;
        letter-spacing: 0.5px;
      }

      .mode-badge mat-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
      }

      .mode-badge.view {
        background: rgba(14, 165, 233, 0.1);
        color: #0284c7;
        border: 1px solid rgba(14, 165, 233, 0.2);
      }

      .mode-badge.edit {
        background: rgba(245, 158, 11, 0.1);
        color: #d97706;
        border: 1px solid rgba(245, 158, 11, 0.2);
      }

      .mode-badge.add {
        background: rgba(99, 102, 241, 0.1);
        color: #4f46e5;
        border: 1px solid rgba(99, 102, 241, 0.2);
      }

      .close-btn {
        color: #64748b !important;
      }

      .close-btn:hover {
        background: rgba(0, 0, 0, 0.04);
      }

      /* Grid Layout */
      .dialog-body {
        padding: 0 !important;
        max-height: none !important;
        overflow: visible !important;
      }

      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      .span-2 {
        grid-column: span 2;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .custom-label {
        font-size: 11px;
        font-weight: 700;
        color: #475569;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .full-width {
        width: 100%;
      }

      /* Material Form Field Customization for Light Theme */
      .dialog-wrapper .mat-mdc-form-field {
        border-radius: 8px;
      }

      .dialog-wrapper .mat-mdc-text-field-wrapper {
        background-color: #f8fafc !important;
      }

      .dialog-wrapper input.mat-mdc-input-element,
      .dialog-wrapper .mat-mdc-select-value-text {
        color: #0f172a !important;
      }

      .dialog-wrapper .mdc-text-field--outlined .mdc-notched-outline__leading,
      .dialog-wrapper .mdc-text-field--outlined .mdc-notched-outline__notch,
      .dialog-wrapper .mdc-text-field--outlined .mdc-notched-outline__trailing {
        border-color: #cbd5e1 !important;
        border-width: 1px !important;
      }

      .dialog-wrapper .mat-mdc-form-field:hover .mdc-notched-outline__leading,
      .dialog-wrapper .mat-mdc-form-field:hover .mdc-notched-outline__notch,
      .dialog-wrapper .mat-mdc-form-field:hover .mdc-notched-outline__trailing {
        border-color: #94a3b8 !important;
      }

      .dialog-wrapper .mat-mdc-form-field.mat-focused .mdc-notched-outline__leading,
      .dialog-wrapper .mat-mdc-form-field.mat-focused .mdc-notched-outline__notch,
      .dialog-wrapper .mat-mdc-form-field.mat-focused .mdc-notched-outline__trailing {
        border-color: #6366f1 !important;
        border-width: 2px !important;
      }

      /* Red Validation Error Border */
      .dialog-wrapper .mdc-text-field--invalid .mdc-notched-outline__leading,
      .dialog-wrapper .mdc-text-field--invalid .mdc-notched-outline__notch,
      .dialog-wrapper .mdc-text-field--invalid .mdc-notched-outline__trailing {
        border-color: #ef4444 !important;
        border-width: 2px !important;
      }

      .dialog-wrapper .mat-mdc-form-field-error {
        color: #dc2626 !important;
      }

      /* Footer & Buttons */
      .dialog-footer {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 12px;
        margin-top: 28px;
        padding-top: 20px;
        border-top: 1px solid #e2e8f0;
      }

      .btn-cancel {
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        color: #334155;
        padding: 10px 20px;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-cancel:hover {
        background: #e2e8f0;
      }

      .btn-save {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: #6366f1;
        color: #ffffff;
        border: none;
        padding: 10px 24px;
        border-radius: 10px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
      }

      .btn-save:hover {
        background: #4f46e5;
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
      }

      .btn-save[disabled] {
        background: #e2e8f0;
        color: #94a3b8;
        box-shadow: none;
        cursor: not-allowed;
      }
    `,
  ],
})
export class StudentDialogComponent implements OnInit {
  studentForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<StudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  ngOnInit(): void {
    const isView = this.data.mode === 'view';

    this.studentForm = this.fb.group({
      Roll_No: [{ value: '', disabled: isView }, [Validators.required]],
      Name: [{ value: '', disabled: isView }, [Validators.required, Validators.minLength(3)]],
      Section: [{ value: '', disabled: isView }, [Validators.required]],
      Attendance: [
        { value: '', disabled: isView },
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      Monthly_Mark: [
        { value: '', disabled: isView },
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      Parent_Name: [{ value: '', disabled: isView }, [Validators.required]],
      Parent_Email: [{ value: '', disabled: isView }, [Validators.required, Validators.email]],
    });

    if (this.data.student) {
      this.studentForm.patchValue(this.data.student);
    }
  }

  onSave(): void {
    if (this.studentForm.valid) {
      this.dialogRef.close(this.studentForm.value);
    }
  }
}
