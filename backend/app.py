# Backend App python file

#os helps interact with the operating system (like file paths).
#sys gives access to system-specific parameters and functions.
import sys
import os

# This line makes sure Python can find and import files from the project’s parent directory.
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


from flask import Flask, request, jsonify
from scraper.company_career_scraper import CompanyCareerScraper

# Creates the Flask app instance — this is what runs the backend web server.
app = Flask(__name__)

# This defines a route (a web address endpoint).
# When someone (like your Chrome extension) makes a GET request to /scrape, the function scrape() runs.
@app.route("/scrape", methods=["GET"])
def scrape():
    """
    Receives a compny name and URL from the Chrome extension,
    runs the Selenium scraper, and returns the results as JSON.
    """
    # Gets query parameters from the URL.
    company = request.args.get("company")
    url = request.args.get("url")

    # Checks if either field is missing.
    # If yes, returns a JSON error message and HTTP status code 400 (Bad Request).
    if not company or not url:
        return jsonify({"error":"Missing company or url"}), 400
    
    # Creates a scraper object from your custom class and runs its scrape() method to 
    # collect job data from the company’s career page.
    scraper = CompanyCareerScraper(company, url)
    scraper.scrape()

    # Converts the scraper’s results (probably a list/dict of jobs) into JSON and sends 
    # it back to whoever made the request (the Chrome extension).
    return jsonify(scraper.results)

# This runs the Flask app only if this file is run directly (not imported).
if __name__ == "__main__":
    app.run(debug=True)