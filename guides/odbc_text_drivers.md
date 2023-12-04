# Querying Text or CSV files using SQL Syntax

## Background

Reading text files using the built in `CSV/TEXT` action has certain limitations, 
especially when it comes to reading larger datasets.

- The data once opened is in the same order and format as it is read by the action
  - _Unordered data can lead to inefficient main loops_

Use the [Connect action](https://docs.automationanywhere.com/bundle/enterprise-v2019/page/enterprise-cloud/topics/aae-client/bot-creator/commands/cloud-using-database-connect-action.html) to establish a connection with the database server
that you want to use to automate database-related tasks. 
This action supports Microsoft Access, Microsoft SQL Server, MySQL, Oracle,
PostgreSQL Server and SQLite database servers, as well as the use of CSV, 
Microsoft Excel, and TXT files as databases.

## Prerequisites and Installation

1. Installation of 32-bit ODBC Drivers 
2. Installation of 64-bit ODBC Drivers

These drivers are also installed when you install microsoft office.
I have read that they come with windows since Windows 7, however the Enterprise 
VMs we use were missing these drivers. 
Installing MS Office 2016 also installed these drivers.


## Connection Strings

First off, this extremely useful resource ([connectionstrings.com](https://www.connectionstrings.com/net-framework-data-provider-for-odbc/)) is where most of the below information is sourced.

It's important to note, if you check the **Use 64-bit** checkbox in the `Database Connect` action, 
you will need to use in your connection string, the exact name shown in the ODBC 64-bit driver window.

**32-bit**

`Driver={Microsoft Text Driver (*.txt; *.csv)};Dbq=c:\txtFilesFolder\;Extensions=asc,csv,tab,txt;`

**64-bit**

`Driver=Microsoft Access Text Driver (*.txt, *.csv);Dbq=c:\txtFilesFolder\; Extensions=asc,csv,tab,txt;`


## Usage

1. Drag the `Database Connect` action to your workspace
2. Set the connection string
3. Name your session 
4. Drag the `Database Read From` action to your workspace
5. Update the session id to the same as step 3
6. Write your SQL query to retrieve the data in the required format
7. Drag the `Loop` action to your workspace
8. Select For each row in database query
9. Choose how you want to store the variable, either multiple variables or a Record variable

You will now be able to use each variable in the csv file within your business logic.

## Troubleshooting

### Incorrect data being read from CSV file column / row
The ODBC drivers can sometimes infer types incorrectly, this will result in alphanumerical values being truncated incorrectly

For example, a column value of `S1` can be truncated to `1` when the driver infers a numerical type.

This can be caused by incorrect generation of the CSV file or incorrect encoding.

Some things you can try to fix this issue are:
- Create the file as an XLSX file, then have your Task rename the file to CSV. _If csv file format is a must_
- Define a [schema file](https://learn.microsoft.com/en-us/sql/odbc/microsoft/schema-ini-file-text-file-driver?view=sql-server-ver16) for the ODBC driver to use. This will also require your connection string to be updated to include `IMEX=1`

_Example Connection String:_ `Driver=Microsoft Access Text Driver (*.txt, *.csv);Dbq=c:\txtFilesFolder\; Extensions=asc,csv,tab,txt;IMEX=1;`

_Example `schema.ini` file_

[Microsoft](https://learn.microsoft.com/en-us/sql/odbc/microsoft/schema-ini-file-text-file-driver?view=sql-server-ver16) have a deeper dive into what this configuration refers to

```ini
[csvFileName.csv]
ColNameHeader=True
MaxScanRows=0 
Format=CSVDelimited
Col1="ColumnOneName" Text
Col2="ColumnTwoName" Text
Col3="ColumnThreeName" Integer
```
