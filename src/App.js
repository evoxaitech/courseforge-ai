import React, { useState } from 'react';
import { useCourses } from './hooks/useCourses';
import { useNotification } from './hooks/useNotification';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Generator from './pages/Generator';
import MyCourses from './pages/MyCourses';
import CourseDetail from './pages/CourseDetail';
import Notification from './components/Notification';
import './App.css';

export default function App() {
  const [view, setView] = useState('dashboard');
  const [selectedId, setSelectedId] = useState(null);
  const { courses, addCourse, deleteCourse, updateCourse } = useCourses();
  const { notif, show } = useNotification();

  const [totalCreditsUsed, setTotalCreditsUsed] = useState(() => {
    try { return parseInt(localStorage.getItem('courseforge_credits') || '0'); }
    catch { return 0; }
  });

  const navigate = (v, id = null) => {
    setView(v);
    if (id) setSelectedId(id);
    document.querySelector('.app-main')?.scrollTo(0, 0);
  };

  const handleGenerated = (data) => {
    const course = addCourse(data);
    const newCredits = totalCreditsUsed + 3;
    setTotalCreditsUsed(newCredits);
    localStorage.setItem('courseforge_credits', newCredits.toString());
    show('✦ Curriculum saved!');
    navigate('course-detail', course.id);
  };

  const selected = courses.find(c => c.id === selectedId);

  return (
    <div className="app-root">
      <Navbar onNavigate={navigate} />
      <div className="app-body">
        <Sidebar
          currentView={view}
          onNavigate={navigate}
          recentCourses={courses.slice(0, 4)}
          onCourseClick={id => navigate('course-detail', id)}
          creditsUsed={totalCreditsUsed}
          onDeleteCourse={deleteCourse}
        />
        <main className="app-main">
          {view === 'dashboard' && <Dashboard courses={courses} onNavigate={navigate} onCourseClick={id => navigate('course-detail', id)} />}
          {view === 'generator' && <Generator onGenerated={handleGenerated} onNotif={show} />}
          {view === 'courses' && <MyCourses courses={courses} onCourseClick={id => navigate('course-detail', id)} onDelete={deleteCourse} onNavigate={navigate} onNotif={show} />}
          {view === 'course-detail' && selected && <CourseDetail course={selected} onBack={() => navigate('courses')} onUpdate={u => updateCourse(selected.id, u)} onNotif={show} />}
        </main>
      </div>
      {notif && <Notification notif={notif} />}
    </div>
  );
}