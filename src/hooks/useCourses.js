import { useState, useEffect } from 'react';

const KEY = 'courseforge_courses';

export function useCourses() {
  const [courses, setCourses] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(courses));
  }, [courses]);

  const addCourse = (data) => {
    const course = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setCourses(prev => [course, ...prev]);
    return course;
  };

  const deleteCourse = (id) => setCourses(prev => prev.filter(c => c.id !== id));

  const updateCourse = (id, updates) =>
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));

  return { courses, addCourse, deleteCourse, updateCourse };
}