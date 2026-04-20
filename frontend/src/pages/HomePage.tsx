import React from 'react';
import { Box, Typography, Button, Container, Fade, Zoom } from '@mui/material';
import { Restaurant, LocalMall } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setOrderType } from '../redux/slices/cartSlice';

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSelectOrderType = (type: 'dine_in' | 'takeaway') => {
    dispatch(setOrderType(type));
    navigate('/menu');
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #FFC72C 0%, #FFB300 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background elements */}
      <Box sx={{
        position: 'absolute',
        top: '-10%',
        left: '-5%',
        width: '40vw',
        height: '40vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
        zIndex: 0
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '-15%',
        right: '-10%',
        width: '50vw',
        height: '50vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(218,41,28,0.15) 0%, rgba(218,41,28,0) 70%)',
        zIndex: 0
      }} />

      <Container maxWidth="md" sx={{ zIndex: 1, position: 'relative', textAlign: 'center' }}>
        <Fade in timeout={800}>
          <Box sx={{ mb: 8 }}>
            <Typography variant="h2" sx={{
              fontWeight: 900,
              color: '#DA291C',
              textShadow: '2px 2px 0px rgba(255,255,255,0.8), 4px 4px 12px rgba(0,0,0,0.1)',
              letterSpacing: '-1px',
              mb: 2
            }}>
              McAntigrav Kiosk
            </Typography>
            <Typography variant="h5" sx={{
              color: '#333',
              fontWeight: 600,
              maxWidth: '600px',
              mx: 'auto',
              opacity: 0.9
            }}>
              Welcome! Please tap an option below to start your order.
            </Typography>
          </Box>
        </Fade>

        <Box sx={{
          display: 'flex',
          gap: 4,
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Zoom in style={{ transitionDelay: '300ms' }}>
            <Button
              onClick={() => handleSelectOrderType('dine_in')}
              sx={{
                flexDirection: 'column',
                gap: 2,
                backgroundColor: '#fff',
                color: '#DA291C',
                borderRadius: 6,
                p: 5,
                width: { xs: '100%', sm: 300 },
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  backgroundColor: '#fff',
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(218,41,28,0.2)',
                }
              }}
            >
              <Restaurant sx={{ fontSize: 80, color: '#DA291C' }} />
              <Typography variant="h4" sx={{ fontWeight: 800, textTransform: 'none' }}>
                Dine In
              </Typography>
            </Button>
          </Zoom>

          <Zoom in style={{ transitionDelay: '500ms' }}>
            <Button
              onClick={() => handleSelectOrderType('takeaway')}
              sx={{
                flexDirection: 'column',
                gap: 2,
                backgroundColor: '#DA291C',
                color: '#fff',
                borderRadius: 6,
                p: 5,
                width: { xs: '100%', sm: 300 },
                boxShadow: '0 10px 30px rgba(218,41,28,0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  backgroundColor: '#C8102E',
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(218,41,28,0.4)',
                }
              }}
            >
              <LocalMall sx={{ fontSize: 80, color: '#fff' }} />
              <Typography variant="h4" sx={{ fontWeight: 800, textTransform: 'none' }}>
                Takeaway
              </Typography>
            </Button>
          </Zoom>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
