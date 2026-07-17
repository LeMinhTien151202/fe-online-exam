import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from './dashboardApi';

export const DASHBOARD_KEY = ['admin', 'dashboard'];

export const useSummaryQuery = () =>
  useQuery({
    queryKey: [...DASHBOARD_KEY, 'summary'],
    queryFn: dashboardApi.getSummary,
    staleTime: 60_000,
  });

export const useActivityQuery = (days = 30, bucket: 'day' | 'week' = 'day') =>
  useQuery({
    queryKey: [...DASHBOARD_KEY, 'activity', days, bucket],
    queryFn: () => dashboardApi.getActivity(days, bucket),
    staleTime: 60_000,
  });

export const useRecentStudentsQuery = (limit = 5) =>
  useQuery({
    queryKey: [...DASHBOARD_KEY, 'recent-students', limit],
    queryFn: () => dashboardApi.getRecentStudents(limit),
  });

export const useRecentTestsQuery = (limit = 5) =>
  useQuery({
    queryKey: [...DASHBOARD_KEY, 'recent-tests', limit],
    queryFn: () => dashboardApi.getRecentTests(limit),
  });

export const useActivitiesQuery = (limit = 5) =>
  useQuery({
    queryKey: [...DASHBOARD_KEY, 'activities', limit],
    queryFn: () => dashboardApi.getActivities(limit),
  });
