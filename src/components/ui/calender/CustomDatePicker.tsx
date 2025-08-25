'use client';

import React, { useState, useRef, useEffect, JSX } from 'react';

interface CustomDatePickerProps {
    selectedDate: Date | null;
    onChange: (date: Date | null) => void;
    placeholderText?: string;
    id?: string;
}

type DatePickerView = 'year' | 'month' | 'day';

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ selectedDate, onChange, placeholderText, id }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentView, setCurrentView] = useState<DatePickerView>('day');
    const [displayDate, setDisplayDate] = useState(selectedDate || new Date());
    const [yearRangeStart, setYearRangeStart] = useState(1990);
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (selectedDate) {
            setDisplayDate(selectedDate);
        }
    }, [selectedDate]);

    const handleYearSelect = (year: number) => {
        const newDate = new Date(displayDate);
        newDate.setFullYear(year);
        setDisplayDate(newDate);
        setCurrentView('month');
    };

    const handleMonthSelect = (month: number) => {
        const newDate = new Date(displayDate);
        newDate.setMonth(month);
        setDisplayDate(newDate);
        setCurrentView('day');
    };

    const handleDaySelect = (day: number) => {
        const year = displayDate.getFullYear();
        const month = displayDate.getMonth();

        // Set time to noon to avoid timezone-related shifting
        const localSafeDate = new Date(year, month, day, 12, 0, 0);

        onChange(localSafeDate); // Return Date object (local-safe)
        setIsOpen(false);
    };



    const renderYearView = () => {
        const years = Array.from({ length: 12 }, (_, i) => yearRangeStart + i);
        return (
            <div className="p-2">
                <div className="flex justify-between items-center mb-2">
                    <button type="button" onClick={() => setYearRangeStart(prev => prev - 12)} className="p-1 hover:bg-gray-100 rounded">
                        <ChevronLeft />
                    </button>
                    <span className="font-semibold">{yearRangeStart} - {yearRangeStart + 11}</span>
                    <button type="button" onClick={() => setYearRangeStart(prev => prev + 12)} className="p-1 hover:bg-gray-100 rounded">
                        <ChevronRight />
                    </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {years.map((year) => (
                        <button
                            type="button"
                            key={year}
                            className={`p-2 rounded hover:bg-gray-200 ${displayDate.getFullYear() === year ? 'bg-brand-500 text-white' : ''}`}
                            onClick={() => handleYearSelect(year)}
                        >
                            {year}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const renderMonthView = () => {
        const months = Array.from({ length: 12 }, (_, i) =>
            new Date(0, i).toLocaleString('default', { month: 'short' })
        );

        return (
            <div className="p-2">
                <div className="flex justify-between items-center mb-2">
                    <button type="button" onClick={() => setCurrentView('year')} className="p-1 hover:bg-gray-100 rounded">
                        <ChevronLeft />
                    </button>
                    <span className="font-semibold">{displayDate.getFullYear()}</span>
                    <div />
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {months.map((month, idx) => (
                        <button
                            type="button"
                            key={month}
                            className={`p-2 rounded hover:bg-gray-200 ${displayDate.getMonth() === idx ? 'bg-brand-500 text-white' : ''}`}
                            onClick={() => handleMonthSelect(idx)}
                        >
                            {month}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const renderDayView = () => {
        const year = displayDate.getFullYear();
        const month = displayDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startingDay = firstDayOfMonth.getDay();

        const days: JSX.Element[] = [];
        for (let i = 0; i < startingDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-2"></div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const isSelected = selectedDate &&
                selectedDate.getFullYear() === year &&
                selectedDate.getMonth() === month &&
                selectedDate.getDate() === i;
            const isToday = new Date().toDateString() === new Date(year, month, i).toDateString();

            days.push(
                <button
                    type="button"
                    key={i}
                    className={`p-2 rounded hover:bg-gray-200 ${isSelected ? 'bg-brand-500 text-white' : ''} ${isToday && !isSelected ? 'border border-brand-500' : ''}`}
                    onClick={() => handleDaySelect(i)}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="p-2">
                <div className="flex justify-between items-center mb-2">
                    <button type="button" onClick={() => setDisplayDate(new Date(year, month - 1, 1))} className="p-1 hover:bg-gray-100 rounded">
                        <ChevronLeft />
                    </button>
                    <span className="font-semibold">
                        {displayDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button type="button" onClick={() => setDisplayDate(new Date(year, month + 1, 1))} className="p-1 hover:bg-gray-100 rounded">
                        <ChevronRight />
                    </button>
                </div>
                <div className="grid grid-cols-7 text-xs font-medium text-center text-gray-500 mb-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day}>{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">{days}</div>
            </div>
        );
    };

    return (
        <div className="relative" ref={pickerRef}>
            <input
                type="text"
                placeholder={placeholderText}
                value={selectedDate ? selectedDate.toLocaleDateString() : ''}
                onClick={() => {
                    setIsOpen((prev) => !prev);
                    setCurrentView('day');
                }}
                readOnly
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                id={id}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {isOpen && (
                <div className="min-w-[270px] absolute z-10 bg-white border border-gray-300 rounded shadow-lg mt-1">
                    <div className="flex justify-between items-center p-2 border-b border-gray-200">
                        <button type="button" onClick={() => setCurrentView('year')} className="px-2 py-1 rounded hover:bg-gray-100">
                            {displayDate.getFullYear()}
                        </button>
                        <button type="button" onClick={() => setCurrentView('month')} className="px-2 py-1 rounded hover:bg-gray-100">
                            {displayDate.toLocaleString('default', { month: 'long' })}
                        </button>
                    </div>
                    {currentView === 'year' && renderYearView()}
                    {currentView === 'month' && renderMonthView()}
                    {currentView === 'day' && renderDayView()}
                </div>
            )}
        </div>
    );
};

export default CustomDatePicker;

const ChevronLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);