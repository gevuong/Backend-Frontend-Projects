# Stock Watchlist (45min)

**NB: Run `bundle install` before you get started.**

Next, set up the database:

    ./setup_db.sh

**If you run into a permissions issue, try running `chmod +x ./setup_db.sh`**

Welcome to the finance world. We have been tasked to develop an
application for Stock Academy that will allow them to keep track of
users and their watchlists of companies, prices, and executives.

Your task today is to build the relationships between all of these
models. The database has already been setup and the models have been annotated with their respective table schemas.

## Assignment

The specs (`bundle exec rspec`) will guide you through building a
series of associations. Refer to the `db/schema.rb` file to find the format of the database; this will especially help you find the name of foreign keys.

I would start by building `has_many`, `belongs_to` and `has_one`
associations. I would later build the `has_many :through`
associations.

## Brief Description

Make sure to be looking at the specs and the `db/schema.rb`. Part of your job is to be able to understand the structure and interrelations of the data from these sources.

We provide a brief overview. Users of the site create WatchLists to
track the market. A WatchList consists of WatchListItems, each of which tracks a Company for a given period of time.

A Company is controlled by a Board. A Board is comprised of
Executives; an Executive can sit on multiple Boards.

Some companies can be subsidiaries; they have a parent company. A parent company can have multiple subsidiaries.

Each Company is listed on an Exchange. Lastly, we record the Price of the Company each day.
