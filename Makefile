
pswatch:
	@while true; do clear; ps aux | grep phantomjs | grep -v grep; sleep 2 ; done
	
.PHONY: pswatch