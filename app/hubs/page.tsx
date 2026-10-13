import { getHubsSafe, getAnnouncementsSafe } from '@/lib/data/hub'
import HubsClient from '@/components/hubs/HubsClient'

const HubsPage = async () => {
    const [hubs, announcements] = await Promise.all([getHubsSafe(), getAnnouncementsSafe()])

    return <HubsClient initialHubs={hubs} initialAnnouncements={announcements} />
}

export default HubsPage
