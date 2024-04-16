import UpdateIcon from '@mui/icons-material/Update';
import { Autocomplete, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from 'react';
import StatusMapping from './StatusMapping';

interface TaskInterface {
  id: number;
  priority: number;
  title: string;
  project_id: number;
  description: string;
  image_attachment: null | string;
  author: null | string;
  status: string;
  assignee: null | string;
  created_at: string;
  updated_at: string;
}

const handleUpdateStatus = async (id: string, status: string) => {
  try {
    const response = await fetch(`http://localhost:8000/api/tasks/status/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    const data = await response.json();
    // refresh window when status updated
    window.location.reload()
  } catch (error) {
    console.error('Error updating task status:', error);
  }
}

export default function MyTaskTable() {
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [taskId, setTaskId] = useState<number>(0)
  const [selectedStatus, setSelectedStatus] = useState<{ label: string; value: string; } | null>(null);
  const [selectedFilterBy, setSelectedFilterBy] = useState<{ label: string; value: string; } | null>(null);
  const [searchParam, setSearchParam] = useState<string>('');

  const [tasks, setTasks] = useState<TaskInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      // Constructing the request body dynamically
      const requestBody: Record<string, string> = {}; // Use Record<string, string> to indicate that requestBody is an object with string keys and string values
      if (selectedFilterBy?.value) {
        requestBody[selectedFilterBy.value] = searchParam; // Change 'value' to the actual value you want to filter by
      }
      
      try {
        const response = await fetch(`http://localhost:8000/api/tasks/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        setTasks(data.tasks);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setIsLoading(false);
      }
    }

    fetchTasks();
  }, [searchParam, selectedFilterBy]);

  const filterByOption = [
    { label: 'Project Id', value: 'project_id' },
    { label: 'Title', value: 'title' },
    { label: 'Description', value: 'description' },
    { label: 'Image Attachment', value: 'image_attachment' },
    { label: 'Author', value: 'author' },
    { label: 'Assignee', value: 'assignee' },
    { label: 'Priority', value: 'priority' },
    { label: 'Status', value: 'status' },
    { label: 'Created At', value: 'created_at' },
    { label: 'Updated At', value: 'updated_at' },
  ];

  const statusOptions = [
    { label: 'New', value: 'new' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <>
      {/* Search bar */}
      <Box marginBottom={2}>
        <Stack direction={'row'} spacing={1}>
          <Autocomplete
            value={selectedFilterBy}
            onChange={(_event, newValue) => setSelectedFilterBy(newValue)}
            renderInput={(params) => <TextField sx={{ minWidth: '10vw' }} {...params} label="Filter By Column" />}
            options={filterByOption}
          />
          <TextField
            variant="outlined"
            label="Input Search"
            value={searchParam}
            onChange={(e) => setSearchParam(e.target.value)}
          />
        </Stack>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project Id</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Image Attachment</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Assignee</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
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
                  <TableCell>{task.project_id}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.image_attachment}</TableCell>
                  <TableCell>{task.author}</TableCell>
                  <TableCell>{task.assignee}</TableCell>
                  <TableCell>
                    {<StatusMapping status={task.status} />}
                  </TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{new Date(task.created_at).toLocaleString()}</TableCell>
                  <TableCell>{new Date(task.updated_at).toLocaleString()}</TableCell>

                  <TableCell>
                    {<Button onClick={() => { setOpenDialog(true); setTaskId(task.id) }} startIcon={<UpdateIcon />}>Update Status</Button>}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Update Status</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography>Please select the new status.</Typography>
          <Box paddingTop={2}>
            <Autocomplete
              value={selectedStatus}
              onChange={(_event, newValue) => setSelectedStatus(newValue)}
              renderInput={(params) => <TextField {...params} label="Status" />}
              options={statusOptions}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleUpdateStatus(taskId.toString(), selectedStatus!.value)} color="primary" autoFocus disabled={!selectedStatus}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}