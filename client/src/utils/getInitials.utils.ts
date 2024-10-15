export function getInitials(fullName: string) {
    const nameParts = fullName.split(' '); 
    const initials = nameParts.map(part => part[0]).join(''); 
    return initials.toUpperCase(); 
  }