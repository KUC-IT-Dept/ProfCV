import { Profile } from './profileBuilderTypes';
import SectionShell from './SectionShell';

type Props = { profile: Profile; };
export default function ProfessionalMembershipsSection(_props: Props) {
  return <SectionShell title="ProfessionalMemberships" description="ProfessionalMemberships details will be added here." />;
}
