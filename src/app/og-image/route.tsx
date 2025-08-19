import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#ec4899',
          padding: '40px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: '80px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          Chotta Mumbai Vibe
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: '40px',
            color: 'white',
            textAlign: 'center',
          }}
        >
          Experience the vibrant energy of Chotta Mumbai
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}