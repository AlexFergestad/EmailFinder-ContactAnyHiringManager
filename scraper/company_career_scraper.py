# Company Career Scraper Code Here

class CompanyCareerScraper:
    def __init__(self, company_name: str):
        self.company_name = company_name
    
    def scrape(self):
        print(f"Scraping career page for {self.company_name}...")
        # TODO: add logic here later
        return {"company": self.company_name, "emails": []}