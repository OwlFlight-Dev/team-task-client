"use client"; // This is a client component
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import MyTaskTable from "./Component/MyTaskTable";

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

export default function Home() {
  const [tasks, setTasks] = useState<TaskInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch('http://localhost:8000/api/tasks/');
        const data = await response.json();
        setTasks(data.tasks);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setIsLoading(false);
      }
    }

    fetchTasks();
  }, []);

  return (
    <>
      <MyTaskTable tasks={tasks} isLoading={isLoading} />
    </>
  );
}
