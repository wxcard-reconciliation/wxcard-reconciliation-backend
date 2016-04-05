all : test
	
bin :
	bin/wxcard

test:
	npm test
	
patch:
	mongo wxcard test/patch/account_wxclient_incorrect.js
	
.PHONY : bin test patch