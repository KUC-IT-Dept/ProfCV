import { Profile } from './profileBuilderTypes';
import SectionShell from './SectionShell';

type Props = { profile: Profile; };
export default function AwardsHonoursSection(_props: Props) {
  return <SectionShell title="AwardsHonours" description="AwardsHonours details will be added here." />;
}
