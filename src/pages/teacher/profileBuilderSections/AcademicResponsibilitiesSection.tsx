import { Profile } from './profileBuilderTypes';
import SectionShell from './SectionShell';

type Props = { profile: Profile; };
export default function AcademicResponsibilitiesSection(_props: Props) {
  return <SectionShell title="AcademicResponsibilities" description="AcademicResponsibilities details will be added here." />;
}
