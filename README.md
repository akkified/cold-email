# AI-Assisted Professor Cold-Emailer

<p align="center">
  A platform that helps students write thoughtful research outreach emails to professors.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-active-success" />
  <img src="https://img.shields.io/badge/multi--user-supported-blue" />
  <img src="https://img.shields.io/badge/email-gmail%20integration-red" />
  <img src="https://img.shields.io/badge/security-row%20level%20security-green" />
  <img src="https://img.shields.io/badge/license-MIT-lightgrey" />
</p>

---

## Platform Overview

AI-Assisted Professor Cold-Emailer helps students reach out to professors with clear, personalized research emails.  
The platform focuses on authenticity, clarity, and reducing the friction involved in academic outreach.

---

## Core Capabilities

<table>
<tr>
<td width="33%">

### Personalized Email Drafting
Generates outreach emails tailored to a student’s interests and a professor’s research work.

</td>
<td width="33%">

### Multi-User Platform
Students sign in securely and manage their outreach in one place.

</td>
<td width="33%">

### Direct Email Sending
Emails can be sent directly through connected Gmail accounts.

</td>
</tr>

<tr>
<td width="33%">

### Draft Control
Students can edit and refine every generated message.

</td>
<td width="33%">

### Secure Data Model
Each user’s data is isolated with strict access control.

</td>
<td width="33%">

### Research Outreach Workflow
Designed specifically for academic networking and mentorship.

</td>
</tr>
</table>

---

## System Flow

This diagram shows how a student request moves through the platform.

```mermaid
flowchart LR
    A[Student] --> B[Web App]
    B --> C[Email Draft Request]
    C --> D[AI Draft Generation]
    D --> E[Draft Review]
    E --> F[Send Email]
    F --> G[Professor Inbox]

    classDef animate stroke-width:2px;
    class A,B,C,D,E,F,G animate;
```

---

## Application Architecture

```mermaid
flowchart TD
    U[User Session] --> FE[Application Interface]
    FE --> API[Application API]

    API --> AUTH[Authentication]
    API --> AI[Draft Engine]
    API --> DB[User Data]
    API --> EMAIL[Email Service]

    AUTH --> GOOGLE[Google Sign-In]
    AI --> MODEL[Language Model Provider]
    DB --> STORAGE[Database]
    EMAIL --> GMAIL[Gmail API]
```

---

## Outreach Lifecycle

This shows the lifecycle of a research email inside the platform.

```mermaid
sequenceDiagram
    participant Student
    participant App
    participant DraftEngine
    participant EmailService
    participant Professor

    Student->>App: Create outreach request
    App->>DraftEngine: Generate draft
    DraftEngine-->>App: Draft returned
    App-->>Student: Review and edit
    Student->>EmailService: Send email
    EmailService->>Professor: Deliver message
```

---

## What Makes This Platform Different

Most students send generic outreach emails or never reach out at all.  
This system is built to encourage thoughtful communication rather than templates.

Focus areas include:
- clarity
- personalization
- accessibility for students new to research outreach
- scalable multi-user design

---

## Roadmap

Planned improvements include:

Professor research analysis  
Publication-based personalization  
Response tracking  
Follow-up generation  
Outreach insights dashboard

---

## License

MIT License