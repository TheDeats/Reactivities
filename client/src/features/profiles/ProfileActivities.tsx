import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Grid2, Typography } from '@mui/material';
import { Link, useParams } from 'react-router';
import { useProfile } from '../../lib/hooks/useProfile';
import { format } from 'date-fns';

export default function ProfileActivities() {
  const [activeTab, setActiveTab] = useState(0);
  const { id } = useParams();
  const { userActivities, setFilter, loadingUserActivities } = useProfile(id);

  useEffect(() => {
    setFilter('future')
  }, [setFilter])

  const tabs = [
    { menuItem: 'Future Events', key: 'future'},
    { menuItem: 'Past Events', key: 'past'},
    { menuItem: 'Hosting', key: 'hosting'}
  ];

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setFilter(tabs[newValue].key);
  };
  
    return (
    <Box>
        <Grid2 container spacing={2}>
            <Grid2 size={12}>
                <Tabs value={activeTab} onChange={handleChange}>
                    {tabs.map((tab, index) => (
                        <Tab label={tab.menuItem} key={index} />
                    ))}
                </Tabs>
            </Grid2>
        </Grid2>
        {(!userActivities || userActivities.length === 0) && !loadingUserActivities ?
            (<Typography mt={2}>No activities to show</Typography>) : null}
        <Grid2 container spacing={0} sx={{marginTop: 2, height: 400, overflow: 'auto'}}>
            {userActivities && userActivities.map((activity: Activity) => (
                <Grid2 size={3} key={activity.id}>
                    <Link to={`/activities/${activity.id}`} style={{textDecoration: 'none'}}>
                        <Card elevation={4} sx={{marginX: 1, marginBottom: 2}}>
                            <CardMedia
                                component="img"
                                height="100"
                                image={`/images/categoryImages/${activity.category}.jpg`}
                                alt={activity.title}
                                sx={{ objectFit: 'cover'}}
                            />
                            <CardContent>
                                <Typography variant="h6" textAlign='center' mb={1} noWrap>
                                    {activity.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    textAlign="center"
                                    display='flex'
                                    flexDirection='column'
                                >
                                    <span>
                                        {format(activity.date, 'do LLL yyyy')}
                                    </span>
                                    <span>{format(activity.date, 'h:mm a')}</span>
                                </Typography>
                            </CardContent>
                        </Card>
                    </Link>
                </Grid2>
            ))}
        </Grid2>
    </Box>
  )
}