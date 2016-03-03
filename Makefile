all : test
	
bin :
	bin/wxcard

test:
	npm test
	
patch:
	mongo wxcard test/patch/*.js
	
.PHONY : bin test patch