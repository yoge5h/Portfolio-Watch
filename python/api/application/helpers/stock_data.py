from bs4 import BeautifulSoup
import urllib2
import requests
import re
import csv

non_decimal = re.compile(r'[^\d.]+')
def from_nepali_paisa():
    url = "http://www.nepalipaisa.com/"
    page = urllib2.urlopen(url)
    soup = BeautifulSoup(page, 'lxml')
    web_ticker = soup.find_all('ul', {'id':'webticker'})

    stock_data = []
    for quote in web_ticker[0].find_all('li')[:]:
        company_quote = quote.find_all('span')[0].text.split()            
        data = {
            'id': company_quote[0],
            'name': quote.find_all('a')[0]['href'].split('/')[-2].replace('-', ' '),
            'price': float(company_quote[1].replace('Rs.','')),
            'change': float(re.sub('[()%]','',company_quote[2]))
        }
        stock_data.append(data)
    return stock_data

def from_mero_lagani():
    url = "http://merolagani.com/latestmarket.aspx"
    page = urllib2.urlopen(url)
    soup = BeautifulSoup(page, 'lxml')
    stock_data_soup = soup.find_all('table', {'data-live':'live-trading'})[0].find_all('tbody')[0].find_all('tr')

    stock_data = []
    
    for row in stock_data_soup:            
        row_data = row.find_all('td')
        company_title = row_data[0].find_all('a')[0].get('title').split()
        row_class = row.get('class')[0]
        data = {
            'id': company_title[0],
            'name': re.sub('[()]','',' '.join(company_title[1:])),
            'price': float(non_decimal.sub('', row_data[1].text)),
            'change': float(row_data[3].text) * -1 if row_data == "increase-row" else float(row_data[3].text)
        }
        stock_data.append(data)
    return stock_data

def from_nepal_stock():
    pass
    

def get_stock_data():
    try:
        return from_mero_lagani()
    except:
        try:
            return from_nepali_paisa()
        except:
            return []

if __name__ == "__main__":
    import time
    start = time.time()
    get_stock_data()
    print time.time() - start