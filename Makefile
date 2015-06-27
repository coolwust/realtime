.PHONY : test

test :
	@rm -f ./migrations/.migrate && \
	./node_modules/migrate/bin/migrate up 1>/dev/null && \
	(./node_modules/mocha/bin/mocha --harmony --timeout=15000 \
        './test/connect.js' './test/question.js' || true) && \
	./node_modules/migrate/bin/migrate down 1>/dev/null

server :
	@node --harmony server.js

#@rethinkdb --driver-port 28015 1>/dev/null & sleep 1 && \
#rm -Rf rethinkdb_data 1>/dev/null 
#kill -s KILL $$! 1>/dev/null && \
