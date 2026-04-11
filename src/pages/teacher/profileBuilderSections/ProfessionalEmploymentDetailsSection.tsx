import { Profile } from './profileBuilderTypes';
import SectionShell from './SectionShell';

type Props = {
  profile: Profile;
  onUpdate: (f: keyof Profile['professionalDetails'], v: string) => void;
};
export default function ProfessionalEmploymentDetailsSection(_props: Props) {
  return <SectionShell title="Employment" description="Current employment record and appointment details will go here." />;
}
