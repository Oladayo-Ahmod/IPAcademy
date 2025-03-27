# IP Academy - Internet Computer Protocol Learning Platform


## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Live Demo](#live-demo)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Interacting with IP Academy](#interacting-with-ip-academy)
  - [As a Student](#as-a-student)
  - [As an Instructor](#as-an-instructor)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Introduction

IP Academy is a decentralized e-learning platform built on the Internet Computer Protocol (ICP). It allows instructors to create and manage courses while enabling students to discover and enroll in these courses, all powered by blockchain technology.

## Features

- **Internet Identity Authentication**: Secure login using Web3 identity
- **Role-Based Access**: Distinct experiences for students and instructors
- **Course Management**:
  - Create courses with rich metadata
  - Track student enrollment
  - Mark course completion
- **Decentralized Storage**: All data stored on the IC blockchain
- **Responsive UI**: Works on all devices with Tailwind CSS styling

## Live Demo

Access the live platform at: [https://ip-academy.vercel.app/](https://ip-academy.vercel.app/)

## Technologies Used

- **Frontend**:
  - Next.js (React)
  - Tailwind CSS
  - React Toastify
- **Blockchain**:
  - Internet Computer Protocol (ICP)
  - Azle (Canister smart contracts)
- **Authentication**:
  - Internet Identity
- **Deployment**:
  - Vercel (Frontend)
  - Internet Computer Mainnet (Canisters)

## Getting Started

### Prerequisites

- Node.js (v22+)
- DFX SDK (v0.14.0+)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Oladayo-Ahmod/IPAcademy.git
   cd ip_academy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start local development:
   ```bash
   dfx start --background
   npm run dev
   ```

4. Deploy canisters locally:
   ```bash
   dfx deploy
   ```

## Interacting with IP Academy

### As a Student

1. **Login** with Internet Identity
2. **Select "I'm a Student"** during first visit
3. **Complete registration** (one-time process)
4. **Browse available courses**
5. **Enroll in courses** with one click
6. **Track your progress** in "My Courses" section

### As an Instructor

1. **Login** with Internet Identity
2. **Select "I'm a Course Creator"** during first visit
3. **Create new courses** with:
   - Title and description
   - Duration and price
   - Skill level and prerequisites
4. **Manage your courses**:
   - View enrolled students
   - Update course details
   - Track engagement



### Canisters to ICP Mainnet

1. Ensure you have cycles in your wallet
2. Deploy to mainnet:
   ```bash
   dfx deploy --network ic
   ```

## License

Distributed under the MIT License. See `LICENSE` for more information.
