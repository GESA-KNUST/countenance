import { ImageResponse } from 'next/og'

export const runtime = 'edge'


export const alt = 'GESA-KNUST'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 60,
                    background: '#000000',
                    color: 'white',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                    border: '16px solid #FFBE00',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >

                    <div style={{ fontSize: 90, fontWeight: 900, color: '#FFBE00', marginBottom: 20, letterSpacing: '-0.05em' }}>
                        GESA-KNUST
                    </div>

                    <div style={{ fontSize: 40, fontWeight: 500, opacity: 0.9 }}>
                        Building Civilization
                    </div>

                    <div style={{ fontSize: 24, marginTop: 40, opacity: 0.6 }}>
                        The Official Website
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
