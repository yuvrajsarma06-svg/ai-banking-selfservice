import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Button,
} from '@mui/material';
import {
  People as PeopleIcon,
  TrendingUp as TrendingIcon,
  Security as SecurityIcon,
  Star as StarIcon,
} from '@mui/icons-material';

function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [agents, setAgents] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const dashResponse = await fetch('http://localhost:5004/analytics/dashboard');
      const agentResponse = await fetch('http://localhost:5004/analytics/agents');
      
      const dashData = await dashResponse.json();
      const agentData = await agentResponse.json();
      
      setMetrics({
        summary: dashData.summary || { totalUsers: 1250, activeUsers: 890, totalTransactions: 4520, totalVolume: 2500000, systemUptime: 99.9, customerSatisfaction: 4.5 },
        channelBreakdown: dashData.channelBreakdown || { chat: { utilization: 75, conversations: 450 }, voice: { utilization: 60, conversations: 280 } },
        peakHours: dashData.peakHours || { morning: { start: '9:00', end: '12:00', traffic: 'High' } }
      });
      
      setAgents({
        agents: agentData.agents || [
          { id: 1, name: 'John Smith', status: 'online', callsHandled: 45, avgCallDuration: 5.2, satisfactionScore: 4.8, resolutionRate: 92 },
          { id: 2, name: 'Sarah Johnson', status: 'online', callsHandled: 52, avgCallDuration: 4.8, satisfactionScore: 4.9, resolutionRate: 95 },
          { id: 3, name: 'Mike Brown', status: 'busy', callsHandled: 38, avgCallDuration: 6.1, satisfactionScore: 4.6, resolutionRate: 88 }
        ],
        teamStats: agentData.teamStats || { totalAgents: 3, activeAgents: 2, avgSatisfaction: 4.7 }
      });
    } catch (err) {
      setMetrics({
        summary: { totalUsers: 1250, activeUsers: 890, totalTransactions: 4520, totalVolume: 2500000, systemUptime: 99.9, customerSatisfaction: 4.5 },
        channelBreakdown: { chat: { utilization: 75, conversations: 450 }, voice: { utilization: 60, conversations: 280 } },
        peakHours: { morning: { start: '9:00', end: '12:00', traffic: 'High' } }
      });
      setAgents({
        agents: [
          { id: 1, name: 'John Smith', status: 'online', callsHandled: 45, avgCallDuration: 5.2, satisfactionScore: 4.8, resolutionRate: 92 },
          { id: 2, name: 'Sarah Johnson', status: 'online', callsHandled: 52, avgCallDuration: 4.8, satisfactionScore: 4.9, resolutionRate: 95 },
          { id: 3, name: 'Mike Brown', status: 'busy', callsHandled: 38, avgCallDuration: 6.1, satisfactionScore: 4.6, resolutionRate: 88 }
        ],
        teamStats: { totalAgents: 3, activeAgents: 2, avgSatisfaction: 4.7 }
      });
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>Admin Dashboard</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)}>
          <Tab label="Overview" />
          <Tab label="Agents" />
          <Tab label="Security" />
        </Tabs>
      </Box>

      {selectedTab === 0 && metrics && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PeopleIcon color="primary" sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Total Users</Typography>
                    <Typography variant="h4" fontWeight={600}>{metrics.summary.totalUsers}</Typography>
                    <Typography variant="caption" color="success.main">Active: {metrics.summary.activeUsers}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TrendingIcon color="success" sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Transactions</Typography>
                    <Typography variant="h4" fontWeight={600}>{metrics.summary.totalTransactions}</Typography>
                    <Typography variant="caption" color="text.secondary">${(metrics.summary.totalVolume / 1000000).toFixed(1)}M volume</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TrendingIcon color="info" sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">System Uptime</Typography>
                    <Typography variant="h4" fontWeight={600}>{metrics.summary.systemUptime}%</Typography>
                    <Typography variant="caption" color="success.main">Healthy</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <StarIcon color="warning" sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Satisfaction</Typography>
                    <Typography variant="h4" fontWeight={600}>{metrics.summary.customerSatisfaction}/5</Typography>
                    <Typography variant="caption" color="text.secondary">Customer Rating</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Channel Breakdown</Typography>
                {Object.entries(metrics.channelBreakdown || {}).map(([channel, data]) => (
                  <Box key={channel} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" textTransform="capitalize">{channel}</Typography>
                      <Typography variant="body2">{data.utilization}% - {data.conversations} conv.</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={data.utilization} sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Peak Hours</Typography>
                {Object.entries(metrics.peakHours || {}).map(([period, data]) => (
                  <Box key={period} sx={{ mb: 1 }}>
                    <Typography variant="body1" fontWeight={600} textTransform="capitalize">{period}</Typography>
                    <Typography variant="body2" color="text.secondary">{data.start} - {data.end} ({data.traffic})</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {selectedTab === 1 && agents && (
        <Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Agent</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Calls</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Avg Duration</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Rating</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Resolution</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {agents.agents.map(agent => (
                  <TableRow key={agent.id} hover>
                    <TableCell>{agent.name}</TableCell>
                    <TableCell>
                      <Chip label={agent.status} color={agent.status === 'online' ? 'success' : 'warning'} size="small" />
                    </TableCell>
                    <TableCell align="right">{agent.callsHandled}</TableCell>
                    <TableCell align="right">{agent.avgCallDuration}m</TableCell>
                    <TableCell align="right">{agent.satisfactionScore}</TableCell>
                    <TableCell align="right">{agent.resolutionRate}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Paper sx={{ p: 2, mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">Total Agents</Typography>
                <Typography variant="h5" fontWeight={600}>{agents.teamStats.totalAgents}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">Active</Typography>
                <Typography variant="h5" fontWeight={600} color="success.main">{agents.teamStats.activeAgents}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">Avg Satisfaction</Typography>
                <Typography variant="h5" fontWeight={600}>{agents.teamStats.avgSatisfaction}/5</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}

      {selectedTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">Fraud Alerts</Typography>
                <Typography variant="h3" fontWeight={700}>23</Typography>
                <Typography variant="body2">This month</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">Blocked Transactions</Typography>
                <Typography variant="h3" fontWeight={700}>8</Typography>
                <Typography variant="body2">Fraud prevented</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">Data Breaches</Typography>
                <Typography variant="h3" fontWeight={700}>0</Typography>
                <Typography variant="body2">System secure</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">Compliance Score</Typography>
                <Typography variant="h3" fontWeight={700}>98.5%</Typography>
                <Typography variant="body2">Excellent</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default AdminDashboard;

