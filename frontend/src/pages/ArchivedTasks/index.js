import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";

const getStatusColor = (status) => {
  switch (status) {
    case "not_started":
      return "default";
    case "in_progress":
      return "primary";
    case "pending_approval":
      return "warning";
    case "done":
      return "success";
    case "archived":
      return "error";
    default:
      return "default";
  }
};

function ArchivedTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchArchivedTasks = async () => {
      try {
        const response = await axios.get("/api/tasks/archived");
        setTasks(response.data);
        setError(null);
      } catch (error) {
        setError("Failed to fetch archived tasks");
        console.error("Error fetching archived tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.permissions?.includes("access_archives")) {
      fetchArchivedTasks();
    } else {
      setError("You don't have permission to view archived tasks");
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Archived Tasks
      </Typography>

      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div" noWrap>
                  {task.title}
                </Typography>
                <Box sx={{ mt: 1, mb: 2 }}>
                  <Chip
                    label={task.status.replace("_", " ").toUpperCase()}
                    color={getStatusColor(task.status)}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={task.department}
                    variant="outlined"
                    size="small"
                  />
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {task.description
                    ? task.description.substring(0, 100)
                    : "No description available"}
                  ...
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Created by: {task.created_by}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ArchivedTasks;
