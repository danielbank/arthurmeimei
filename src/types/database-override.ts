import { Database as OriginalDatabase } from './database'

export type DatabaseOverride = Omit<OriginalDatabase, 'public'> & {
  public: Omit<OriginalDatabase['public'], 'Tables'> & {
    Tables: Omit<OriginalDatabase['public']['Tables'], 'groups'>
  }
}
