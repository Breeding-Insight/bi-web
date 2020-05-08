import Vue from 'vue';

class EventBusHandler {
  bus = new Vue();
  programChange = 'program-change';
}

export const EventBus = new EventBusHandler();
