# Campaign Management Web Application

This project is a full-stack web application designed for managing advertising campaigns and their associated payouts. It consists of a React.js frontend and an Express.js backend.

## Project Overview

The "Campaign Management" application provides an interface for users to create new campaigns, define their payout structures (country and amount) and track their operational status (running/paused).

**Key functionalities include:**
* **Campaign Lifecycle Management:** Create, view, update, and delete campaign records.
* **Payout Configuration:** Associate multiple payouts with each campaign, allowing specification of amounts per country.

---

## Project Structure & Architecture

The project follows a client-server architecture:
* **Frontend (`frontend/`):** The client application built with React.js, providing the user interface.
* **Backend (`backend/`):** A RESTful API built with Express.js (Node.js), responsible for business logic, data storage, and serving API requests.
* **Database & Cache:** MySQL for data storage and Redis for caching apis, both managed via Docker containers.

---

## Technologies Used

### Frontend (`frontend/`) 
[Link to documentation](https://github.com/igabice/campaign-management/tree/main/frontend#readme)

### Backend (`backend/`)
[Link to documentation](https://github.com/igabice/campaign-management/tree/main/backend#readme)

---

## Screenshots

### Campaigns Table
This view displays a list of all campaigns, showing key information at a glance.
![Campaigns Table](https://github.com/igabice/campaign-management/blob/main/images/campaigns-table.png)

### Filter/Search Campaigns
This view displays searching campaigns by name, landing url and filtering by status (running/paused).
![Search Campaign](https://github.com/igabice/campaign-management/blob/main/images/search-campaign.png)

### Create Campaign
This modal allows users to create a new campaign.
![Create Campaign](https://github.com/igabice/campaign-management/blob/main/images/create-campaign.png)

### View Campaign
This view shows details about a new campaign.
![View Campaign](https://github.com/igabice/campaign-management/blob/main/images/view-campaign.png)

### Edit Campaign
This modal allows users to edit a campaign.
![Edit Campaign](https://github.com/igabice/campaign-management/blob/main/images/edit-campaign.png)

### Delete Campaign
A confirmation dialog ensures users intend to delete a campaign before the action is finalized.
![Delete Campaign](https://github.com/igabice/campaign-management/blob/main/images/delete-campaign.png)

### Create Payout
This modal allows users to create a payout for a campaign.
![Create Payout](https://github.com/igabice/campaign-management/blob/main/images/create-payout.png)


--- 

## Getting Started

Follow these steps to set up and run the application locally.

### Prerequisites

Ensure you have the following installed on your system:

* **Node.js & npm / Yarn:** [Download Node.js](https://nodejs.org/) (npm is included; install Yarn separately if preferred).
* **Docker & Docker Compose:** [Install Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose).

### Installation

You can

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/igabice/campaign-management.git](https://github.com/igabice/campaign-management.git)
    cd campaign-management
    ```
2.  **Install Frontend Dependencies:**
    ```bash
    cd frontend
    npm install # or yarn install
    cd ..
    ```
3.  **Install Backend Dependencies:**
    ```bash
    cd ../backend
    npm install # or yarn install
    cd ..
    ```

### Starting the Application Easily

A convenient bash script is provided in the root directory to start all services (frontend, backend, MySQL & Redis) with a single command.

*Note:* If ports 3000 & 3001 are not free on your system, please update `FRONTEND_PORT` & `BACKEND_PORT` in the `start.sh` script before running.

1.  **Make the script executable:**
    ```bash
    chmod +x start.sh
    ```
2.  **Run the script:**
    ```bash
    ./start.sh
    ```

**What the script does:**

The `start.sh` script initiates the startup process for all services:

* **Starts Docker Services:** It first navigates to the `backend/` directory and uses `docker-compose -f docker-compose.only-db-redis.yml up -d` to spin up a MySQL database and Redis server in detached mode.
* **Installs Dependencies:** It installs dependencies for backend and frontend services.
* **Starts Backend API:** It then starts the  backend service in development mode (`npm run dev`).
* **Starts Frontend App:** Next, it navigates to the `frontend/` directory and starts the frontend app (`npm start`). This command will take over your current terminal with a prompt that accepts commands to kill all services.

### Stopping the Application

To cleanly shut down all running services type `q or exit` in the open terminal prompt and the script kills frontend, backend and docker services.


### Manually killing docker services

    ```bash
    cd backend
    docker-compose -f docker-compose.only-db-redis.yml down
    ```


