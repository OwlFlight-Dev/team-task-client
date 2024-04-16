import React from 'react';
import UpdateIcon from '@mui/icons-material/Update';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button } from "@mui/material";

interface TaskInterface {
  id: number;
  priority: number;
  title: string;
  project_id: number;
  description: string;
  image_attachment: null | string;
  author: null | string;
  status: null | string;
  assignee: null | string;
  created_at: string;
  updated_at: string;
  project: object;
}

interface TaskTableProps {
  tasks: TaskInterface[];
  isLoading: boolean;
}

const updateTaskStatus = async (id: Number, status: String) => {
  try {
    const response = await fetch(`http://localhost:8000/api/tasks/status/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    const data = await response.json();
    // Handle the response data as needed
  } catch (error) {
    console.error('Error updating task status:', error);
    // Optionally, you can display an error message to the user
  }
}

const MyTaskTable: React.FC<TaskTableProps> = ({ tasks, isLoading }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Image Attachment</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Assignee</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Updated At</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell>Loading...</TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell padding="checkbox">
                  <Checkbox color="primary" />
                </TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.image_attachment}</TableCell>
                <TableCell>{task.author}</TableCell>
                <TableCell>{task.assignee}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{task.created_at}</TableCell>
                <TableCell>{task.updated_at}</TableCell>
                <TableCell>{<Button onClick={() => updateTaskStatus(task.id, 'completed')} startIcon={<UpdateIcon/>}>Update Status</Button>}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default MyTaskTable;