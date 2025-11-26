#!/bin/bash

# Fetch Twin Cities climate data for all decades from 1870s to present
# Data source: RCC-ACIS (Regional Climate Centers - Applied Climate Information System)

set -e

OUTPUT_DIR="${1:-.}"

fetch_decade() {
  local decade_start=$1
  local start_year=$((decade_start))
  local end_year=$((decade_start + 9))
  local current_year=$(date +%Y)
  
  # Don't fetch future data
  if [ $start_year -gt $current_year ]; then
    return
  fi
  
  # Cap end year at current year
  if [ $end_year -gt $current_year ]; then
    end_year=$current_year
  fi
  
  local sdate="${start_year}-01-01"
  local edate="${end_year}-12-31"
  local output_file="${OUTPUT_DIR}/twin_cities_${decade_start}s.json"
  
  echo "Fetching ${decade_start}s (${sdate} to ${edate})..."
  
  # URL encode the params JSON
  local params="{\"sid\":\"mspthr\",\"sdate\":\"${sdate}\",\"edate\":\"${edate}\",\"elems\":[{\"name\":\"maxt\",\"interval\":\"dly\",\"duration\":\"dly\",\"add\":\"t\"},{\"name\":\"mint\",\"interval\":\"dly\",\"duration\":\"dly\",\"add\":\"t\"},{\"name\":\"pcpn\",\"interval\":\"dly\",\"duration\":\"dly\",\"add\":\"t\"},{\"name\":\"snow\",\"interval\":\"dly\",\"duration\":\"dly\",\"add\":\"t\"},{\"name\":\"snwd\",\"interval\":\"dly\",\"duration\":\"dly\",\"add\":\"t\"}]}"
  
  curl -s 'https://data.rcc-acis.org/StnData' \
    -H 'Accept: application/json, text/javascript, */*; q=0.01' \
    -H 'Content-Type: application/json' \
    -H 'Referer: https://www.dnr.state.mn.us/' \
    --data-raw "{\"params\":${params}}" > "$output_file"
  
  echo "  -> Saved to ${output_file}"
}

# Fetch all decades from 1870s to 2020s
for decade in $(seq 1870 10 2020); do
  fetch_decade $decade
  # Be nice to the API
  sleep 1
done

echo "Done!"