# NBA Lineup Optimizer

The NBA Lineup Optimizer is a web application that allows users to calculate the optimal lineup for DraftKings contests. Users can input a specific DraftKings contest ID, and the application will fetch player data, calculate the optimal lineup based on the players' projected points and salaries, and display the results.

## Features

- Fetch player data based on a DraftKings contest ID
- Calculate the optimal lineup for the contest
- Display player data in a table
- Display the optimal lineup in a separate table
- Show total salary and projected points for the optimal lineup

## Installation

1. Install [Node.js](https://nodejs.org/en/) if you haven't already.
2. Clone the repository:
   git clone https://github.com/Ollstar/lineupoptimizer.git
3. Navigate to the project directory:
   cd lineupoptimzer
4. Install the required dependencies:
   npm install
5. Create a `.env` file in the project root directory with the following content:
   WEB_URL=your_website_url_here (Use http://localhost:3000 for local)
   Replace `your_website_url_here` with the URL of your website. This is required for the application to work properly. (Use local)
6. Start the server:
   npm run dev
7. Open your web browser and visit `http://localhost:3000`. The application should now be running.

## Usage

1. Enter a DraftKings contest ID in the input field.
2. Click the "Update Players" button to fetch the player data for the entered contest ID. The player data will be displayed in the "All Players" table.
3. Click the "Calculate Optimal Lineup" button. The application will calculate the optimal lineup and display it in the "Optimal Lineup" table along with the total salary and projected points.

## Contributing

I welcome contributions to the NBA Lineup Optimizer project! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch in your fork with a descriptive name related to the changes you plan to make.
3. Make your changes in the new branch.
4. Commit and push your changes to your fork.
5. Create a pull request to the main repository with a clear and concise description of your changes.

Before submitting your pull request, please make sure your changes are well-tested and follow the project's coding style.

## License

The NBA Lineup Optimizer is open-source software licensed under the MIT License. Please see the [LICENSE](LICENSE) file for more information.
