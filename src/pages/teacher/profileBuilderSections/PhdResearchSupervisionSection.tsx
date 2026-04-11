import { Profile } from './profileBuilderTypes';
import SectionShell from './SectionShell';

type Props = { profile: Profile; };
export default function PhdResearchSupervisionSection(_props: Props) {
  return <SectionShell title="PhdResearchSupervision" description="PhdResearchSupervision details will be added here." />;
}
