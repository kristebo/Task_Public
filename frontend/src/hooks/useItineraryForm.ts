import { NewItineraryInput, FlightSegment } from '../lib/api';

import { useForm } from './useForm';

export type DraftSegment = Omit<FlightSegment, 'id'>;

type ItineraryFormValues = Omit<NewItineraryInput, 'status'>;

export function useItineraryForm() {
  return useForm<ItineraryFormValues>({ employeeId: '', purpose: '', segments: [] }, (v) => {
    const errs: Partial<Record<string, string>> = {};
    if (!v.employeeId) errs.employeeId = 'Employee required';
    if (!v.purpose.trim() || v.purpose.trim().length < 3) errs.purpose = 'Min 3 chars';
    if (!v.segments.length) errs.segments = 'At least one segment';
    else {
      v.segments.forEach((s, i) => {
        if (!s.from || s.from.length !== 3) errs[`segments.${i}.from`] = 'IATA';
        if (!s.to || s.to.length !== 3) errs[`segments.${i}.to`] = 'IATA';
        if (!s.departure) errs[`segments.${i}.departure`] = 'Required';
        if (!s.arrival) errs[`segments.${i}.arrival`] = 'Required';
        if (!s.carrier || s.carrier.length < 2) errs[`segments.${i}.carrier`] = 'Carrier';
        if (!s.flightNumber || s.flightNumber.length < 2)
          errs[`segments.${i}.flightNumber`] = 'Flight#';
      });
    }
    return errs;
  });
}
