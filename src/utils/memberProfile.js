export function getMemberProfile(user) {
  const metadata = user?.user_metadata || {};
  const fullName = metadata.full_name?.trim() || user?.email?.split('@')[0] || 'ANC Member';
  const firstName = fullName.split(/\s+/)[0] || 'Member';
  const membershipNumber = metadata.membership_number?.trim() || 'Membership pending';
  const branchName = metadata.branch_name?.trim() || 'Branch not yet assigned';

  return {
    fullName,
    firstName,
    membershipNumber,
    branchName,
    phoneNumber: metadata.phone_number?.trim() || 'Not provided',
    email: user?.email || 'Not provided',
  };
}
