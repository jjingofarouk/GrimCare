'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, Box } from '@mui/material';
import * as doctorService from './doctorService';
import ScheduleForm from './ScheduleForm';

const DoctorSchedule = () => {
  const params = useParams();
  const doctorId = params?.doctorId;

  const [schedules, setSchedules] = useState([]);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!doctorId) return;
      const data = await doctorService.getDoctorSchedule(doctorId);
      setSchedules(data);
    };
    fetchSchedule();
  }, [doctorId]);

  const handleAddSchedule = async (schedule) => {
    const newSchedule = await doctorService.createSchedule({ ...schedule, doctorId });
    setSchedules((prev) => [...prev, newSchedule]);
    setOpenForm(false);
  };

  return (
    <Box p={3}>
      <Button variant="contained" onClick={() => setOpenForm(true)} sx={{ mb: 2 }}>
        Add Schedule
      </Button>

      {openForm && (
        <ScheduleForm onSave={handleAddSchedule} onCancel={() => setOpenForm(false)} />
      )}

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>{schedule.date}</TableCell>
                <TableCell>{schedule.time}</TableCell>
                <TableCell>{schedule.type}</TableCell>
                <TableCell>{schedule.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default DoctorSchedule;