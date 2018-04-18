'use strict';

const assert = require('assert');
const EventEmitter = require('events').EventEmitter;
const LDJClient = require('../lib/ldj-client');

describe('LDJClient', () => {
    let stream = null;
    let client = null;

    beforeEach(() => {
        stream = new EventEmitter();
        client = new LDJClient(stream);
    });

    it('should emit a message event from a single data event', done => {
        client.on('message', message => {
            assert.deepEqual(message, {foo: 'bar'});
            done();
        });
        stream.emit('data', '{"foo":');
        process.nextTick(() => stream.emit('data', '"bar"}\n'));
    });

    it('should emit a message event from two data events', done => {
        client.on('message', message => {
            assert.deepEqual(message, {foo: 'bar'});
            done();
        });
        stream.emit('data', '{"foo');
        process.nextTick(() => stream.emit('data', '":"b'));
        process.nextTick(() => stream.emit('data', 'ar"}\n'));
    });
});

describe('LDJClient with null stream', () => {
    let stream = null;
    let client = null;

    it('should throw an error when LDJClient constructor receives null stream', done => {
        assert.throws(
            () => {
                client = new LDJClient(stream);
            },
            /^Error: Stream can not be null$/
        );
        done();
    });
});