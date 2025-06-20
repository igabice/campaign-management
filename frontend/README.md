# Campaign Management Frontend


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Technologies Used

* **React:** A JavaScript library for building user interfaces.
* **Chakra UI:** A simple, modular component library for React, used for building the user interface with speed and ease.
* **Axios:** A HTTP client for making API requests to the backend.
* **Zod:** A TypeScript-first schema declaration and validation library, used for client-side form validation.
* **React Router DOM:** For declarative routing within the application.

## Features

### Campaign Management

* **View Campaigns:** Display a paginated list of all campaigns.
* **Create Campaigns:** Add new campaigns with details like title, landing page URL, status (running/inactive), and initial payouts.
* **Edit Campaigns:** Modify existing campaign details.
* **Delete Campaigns:** Remove campaigns from the system.
* **Campaign Details:** View detailed information for a single campaign.

### Payout Management (within Campaigns)

* **Add Payouts:** Create new payouts for specific campaigns, specifying the country and amount. 
* **Delete Payouts:** Delete payouts associated with a campaign.

---

## Environment Setup

Please set environment variable ` REACT_APP_API_BASE_URL` for the backend if the backend is not running on `http://localhost:3001`

---

## Available Scripts

In the frontend project directory, you can run:


### `npm install`

To install all dependencies

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3001](http://localhost:3001) to view it in the browser.
The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### To run build

    ```bash
    npm install -g serve # or yarn global add serve
    npm run server # yarn serve -s build 
    ```
