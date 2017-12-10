"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
require("rxjs/add/observable/bindCallback");
require("rxjs/add/observable/bindNodeCallback");
require("rxjs/add/observable/defer");
require("rxjs/add/observable/forkJoin");
require("rxjs/add/observable/fromEventPattern");
require("rxjs/add/operator/multicast");
var Observable_1 = require("rxjs/Observable");
var asap_1 = require("rxjs/scheduler/asap");
var Subscriber_1 = require("rxjs/Subscriber");
var Subscription_1 = require("rxjs/Subscription");
var rxSubscriber_1 = require("rxjs/symbol/rxSubscriber");
Zone.__load_patch('rxjs', function (global, Zone, api) {
    var symbol = Zone.__symbol__;
    var subscribeSource = 'rxjs.subscribe';
    var nextSource = 'rxjs.Subscriber.next';
    var errorSource = 'rxjs.Subscriber.error';
    var completeSource = 'rxjs.Subscriber.complete';
    var unsubscribeSource = 'rxjs.Subscriber.unsubscribe';
    var teardownSource = 'rxjs.Subscriber.teardownLogic';
    var empty = {
        closed: true,
        next: function (value) { },
        error: function (err) { throw err; },
        complete: function () { }
    };
    function toSubscriber(nextOrObserver, error, complete) {
        if (nextOrObserver) {
            if (nextOrObserver instanceof Subscriber_1.Subscriber) {
                return nextOrObserver;
            }
            if (nextOrObserver[rxSubscriber_1.rxSubscriber]) {
                return nextOrObserver[rxSubscriber_1.rxSubscriber]();
            }
        }
        if (!nextOrObserver && !error && !complete) {
            return new Subscriber_1.Subscriber(empty);
        }
        return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
    }
    var patchObservable = function () {
        var ObservablePrototype = Observable_1.Observable.prototype;
        var symbolSubscribe = symbol('subscribe');
        var _symbolSubscribe = symbol('_subscribe');
        var _subscribe = ObservablePrototype[_symbolSubscribe] = ObservablePrototype._subscribe;
        var subscribe = ObservablePrototype[symbolSubscribe] = ObservablePrototype.subscribe;
        Object.defineProperties(Observable_1.Observable.prototype, {
            _zone: { value: null, writable: true, configurable: true },
            _zoneSource: { value: null, writable: true, configurable: true },
            _zoneSubscribe: { value: null, writable: true, configurable: true },
            source: {
                configurable: true,
                get: function () {
                    return this._zoneSource;
                },
                set: function (source) {
                    this._zone = Zone.current;
                    this._zoneSource = source;
                }
            },
            _subscribe: {
                configurable: true,
                get: function () {
                    if (this._zoneSubscribe) {
                        return this._zoneSubscribe;
                    }
                    else if (this.constructor === Observable_1.Observable) {
                        return _subscribe;
                    }
                    var proto = Object.getPrototypeOf(this);
                    return proto && proto._subscribe;
                },
                set: function (subscribe) {
                    this._zone = Zone.current;
                    this._zoneSubscribe = subscribe;
                }
            },
            subscribe: {
                writable: true,
                configurable: true,
                value: function (observerOrNext, error, complete) {
                    // Only grab a zone if we Zone exists and it is different from the current zone.
                    var _zone = this._zone;
                    if (_zone && _zone !== Zone.current) {
                        // Current Zone is different from the intended zone.
                        // Restore the zone before invoking the subscribe callback.
                        return _zone.run(subscribe, this, [toSubscriber(observerOrNext, error, complete)]);
                    }
                    return subscribe.call(this, observerOrNext, error, complete);
                }
            }
        });
    };
    var patchSubscription = function () {
        var unsubscribeSymbol = symbol('unsubscribe');
        var unsubscribe = Subscription_1.Subscription.prototype[unsubscribeSymbol] =
            Subscription_1.Subscription.prototype.unsubscribe;
        Object.defineProperties(Subscription_1.Subscription.prototype, {
            _zone: { value: null, writable: true, configurable: true },
            _zoneUnsubscribe: { value: null, writable: true, configurable: true },
            _unsubscribe: {
                get: function () {
                    if (this._zoneUnsubscribe) {
                        return this._zoneUnsubscribe;
                    }
                    var proto = Object.getPrototypeOf(this);
                    return proto && proto._unsubscribe;
                },
                set: function (unsubscribe) {
                    this._zone = Zone.current;
                    this._zoneUnsubscribe = unsubscribe;
                }
            },
            unsubscribe: {
                writable: true,
                configurable: true,
                value: function () {
                    // Only grab a zone if we Zone exists and it is different from the current zone.
                    var _zone = this._zone;
                    if (_zone && _zone !== Zone.current) {
                        // Current Zone is different from the intended zone.
                        // Restore the zone before invoking the subscribe callback.
                        _zone.run(unsubscribe, this);
                    }
                    else {
                        unsubscribe.apply(this);
                    }
                }
            }
        });
    };
    var patchSubscriber = function () {
        var next = Subscriber_1.Subscriber.prototype.next;
        var error = Subscriber_1.Subscriber.prototype.error;
        var complete = Subscriber_1.Subscriber.prototype.complete;
        Object.defineProperty(Subscriber_1.Subscriber.prototype, 'destination', {
            configurable: true,
            get: function () {
                return this._zoneDestination;
            },
            set: function (destination) {
                this._zone = Zone.current;
                this._zoneDestination = destination;
            }
        });
        // patch Subscriber.next to make sure it run
        // into SubscriptionZone
        Subscriber_1.Subscriber.prototype.next = function () {
            var currentZone = Zone.current;
            var subscriptionZone = this._zone;
            // for performance concern, check Zone.current
            // equal with this._zone(SubscriptionZone) or not
            if (subscriptionZone && subscriptionZone !== currentZone) {
                return subscriptionZone.run(next, this, arguments, nextSource);
            }
            else {
                return next.apply(this, arguments);
            }
        };
        Subscriber_1.Subscriber.prototype.error = function () {
            var currentZone = Zone.current;
            var subscriptionZone = this._zone;
            // for performance concern, check Zone.current
            // equal with this._zone(SubscriptionZone) or not
            if (subscriptionZone && subscriptionZone !== currentZone) {
                return subscriptionZone.run(error, this, arguments, errorSource);
            }
            else {
                return error.apply(this, arguments);
            }
        };
        Subscriber_1.Subscriber.prototype.complete = function () {
            var currentZone = Zone.current;
            var subscriptionZone = this._zone;
            // for performance concern, check Zone.current
            // equal with this._zone(SubscriptionZone) or not
            if (subscriptionZone && subscriptionZone !== currentZone) {
                return subscriptionZone.run(complete, this, arguments, completeSource);
            }
            else {
                return complete.apply(this, arguments);
            }
        };
    };
    var patchObservableInstance = function (observable) {
        observable._zone = Zone.current;
    };
    var patchObservableFactoryCreator = function (obj, factoryName) {
        var symbolFactory = symbol(factoryName);
        if (obj[symbolFactory]) {
            return;
        }
        var factoryCreator = obj[symbolFactory] = obj[factoryName];
        if (!factoryCreator) {
            return;
        }
        obj[factoryName] = function () {
            var factory = factoryCreator.apply(this, arguments);
            return function () {
                var observable = factory.apply(this, arguments);
                patchObservableInstance(observable);
                return observable;
            };
        };
    };
    var patchObservableFactory = function (obj, factoryName) {
        var symbolFactory = symbol(factoryName);
        if (obj[symbolFactory]) {
            return;
        }
        var factory = obj[symbolFactory] = obj[factoryName];
        if (!factory) {
            return;
        }
        obj[factoryName] = function () {
            var observable = factory.apply(this, arguments);
            patchObservableInstance(observable);
            return observable;
        };
    };
    var patchObservableFactoryArgs = function (obj, factoryName) {
        var symbolFactory = symbol(factoryName);
        if (obj[symbolFactory]) {
            return;
        }
        var factory = obj[symbolFactory] = obj[factoryName];
        if (!factory) {
            return;
        }
        obj[factoryName] = function () {
            var initZone = Zone.current;
            var args = Array.prototype.slice.call(arguments);
            var _loop_1 = function (i) {
                var arg = args[i];
                if (typeof arg === 'function') {
                    args[i] = function () {
                        var argArgs = Array.prototype.slice.call(arguments);
                        var runningZone = Zone.current;
                        if (initZone && runningZone && initZone !== runningZone) {
                            return initZone.run(arg, this, argArgs);
                        }
                        else {
                            return arg.apply(this, argArgs);
                        }
                    };
                }
            };
            for (var i = 0; i < args.length; i++) {
                _loop_1(i);
            }
            var observable = factory.apply(this, args);
            patchObservableInstance(observable);
            return observable;
        };
    };
    var patchMulticast = function () {
        var obj = Observable_1.Observable.prototype;
        var factoryName = 'multicast';
        var symbolFactory = symbol(factoryName);
        if (obj[symbolFactory]) {
            return;
        }
        var factory = obj[symbolFactory] = obj[factoryName];
        if (!factory) {
            return;
        }
        obj[factoryName] = function () {
            var _zone = Zone.current;
            var args = Array.prototype.slice.call(arguments);
            var subjectOrSubjectFactory = args.length > 0 ? args[0] : undefined;
            if (typeof subjectOrSubjectFactory !== 'function') {
                var originalFactory_1 = subjectOrSubjectFactory;
                subjectOrSubjectFactory = function () {
                    return originalFactory_1;
                };
            }
            args[0] = function () {
                var subject;
                if (_zone && _zone !== Zone.current) {
                    subject = _zone.run(subjectOrSubjectFactory, this, arguments);
                }
                else {
                    subject = subjectOrSubjectFactory.apply(this, arguments);
                }
                if (subject && _zone) {
                    subject._zone = _zone;
                }
                return subject;
            };
            var observable = factory.apply(this, args);
            patchObservableInstance(observable);
            return observable;
        };
    };
    var patchImmediate = function (asap) {
        if (!asap) {
            return;
        }
        var scheduleSymbol = symbol('scheduleSymbol');
        var flushSymbol = symbol('flushSymbol');
        var zoneSymbol = symbol('zone');
        if (asap[scheduleSymbol]) {
            return;
        }
        var schedule = asap[scheduleSymbol] = asap.schedule;
        asap.schedule = function () {
            var args = Array.prototype.slice.call(arguments);
            var work = args.length > 0 ? args[0] : undefined;
            var delay = args.length > 1 ? args[1] : 0;
            var state = (args.length > 2 ? args[2] : undefined) || {};
            state[zoneSymbol] = Zone.current;
            var patchedWork = function () {
                var workArgs = Array.prototype.slice.call(arguments);
                var action = workArgs.length > 0 ? workArgs[0] : undefined;
                var scheduleZone = action && action[zoneSymbol];
                if (scheduleZone && scheduleZone !== Zone.current) {
                    return scheduleZone.runGuarded(work, this, arguments);
                }
                else {
                    return work.apply(this, arguments);
                }
            };
            return schedule.apply(this, [patchedWork, delay, state]);
        };
    };
    patchObservable();
    patchSubscription();
    patchSubscriber();
    patchObservableFactoryCreator(Observable_1.Observable, 'bindCallback');
    patchObservableFactoryCreator(Observable_1.Observable, 'bindNodeCallback');
    patchObservableFactory(Observable_1.Observable, 'defer');
    patchObservableFactory(Observable_1.Observable, 'forkJoin');
    patchObservableFactoryArgs(Observable_1.Observable, 'fromEventPattern');
    patchMulticast();
    patchImmediate(asap_1.asap);
});
