
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { FilterState } from '@/types';
import { auth } from '@/integrations/firebase/client';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc, setDoc, arrayUnion, updateDoc } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';

interface SavedFilter {
  id: string;
  name: string;
  filter: FilterState;
  date: string;
}

export function useSavedFilters() {
  const [localSavedFilters, setLocalSavedFilters] = useLocalStorage<SavedFilter[]>('saved-filters', []);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load saved filters
  useEffect(() => {
    const loadFilters = async () => {
      // Start with local filters
      setSavedFilters(localSavedFilters);
      
      if (auth.currentUser) {
        try {
          setLoading(true);
          const userDocRef = doc(db, 'users', auth.currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists() && userDoc.data().savedFilters) {
            const cloudFilters = userDoc.data().savedFilters;
            
            // Merge cloud filters with local filters
            // Use Set to ensure unique IDs
            const filterSet = new Map<string, SavedFilter>();
            
            // Add local filters first
            localSavedFilters.forEach(filter => {
              filterSet.set(filter.id, filter);
            });
            
            // Then add cloud filters (overwriting any with same ID)
            cloudFilters.forEach((filter: SavedFilter) => {
              filterSet.set(filter.id, filter);
            });
            
            // Convert back to array
            const mergedFilters = Array.from(filterSet.values());
            
            setSavedFilters(mergedFilters);
            setLocalSavedFilters(mergedFilters);
          }
        } catch (error) {
          console.error('Error loading saved filters:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadFilters();
  }, [auth.currentUser]);

  // Save a filter
  const saveFilter = async (name: string, filter: FilterState) => {
    try {
      setLoading(true);
      const newFilter: SavedFilter = {
        id: `filter_${Date.now()}`,
        name,
        filter,
        date: new Date().toISOString()
      };
      
      // Update local state
      const updatedFilters = [...savedFilters, newFilter];
      setSavedFilters(updatedFilters);
      setLocalSavedFilters(updatedFilters);
      
      // If user is logged in, save to Firestore
      if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          await updateDoc(userDocRef, {
            savedFilters: arrayUnion(newFilter)
          });
        } else {
          await setDoc(userDocRef, {
            savedFilters: [newFilter]
          });
        }
      }
      
      toast({
        title: "Filter saved",
        description: `Your filter "${name}" has been saved`
      });
    } catch (error) {
      console.error('Error saving filter:', error);
      toast({
        title: "Error saving filter",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete a filter
  const deleteFilter = async (id: string) => {
    try {
      setLoading(true);
      // Update local state
      const updatedFilters = savedFilters.filter(filter => filter.id !== id);
      setSavedFilters(updatedFilters);
      setLocalSavedFilters(updatedFilters);
      
      // If user is logged in, update Firestore
      if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        
        await updateDoc(userDocRef, {
          savedFilters: updatedFilters
        });
      }
      
      toast({
        title: "Filter deleted",
        description: "Your saved filter has been deleted"
      });
    } catch (error) {
      console.error('Error deleting filter:', error);
      toast({
        title: "Error deleting filter",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    savedFilters,
    loading,
    saveFilter,
    deleteFilter
  };
}
