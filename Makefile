all : bin
	
bin :
	bin/wxcard

test:
	npm test
	
.PHONY : bin test