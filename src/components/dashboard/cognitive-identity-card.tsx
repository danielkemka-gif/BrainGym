'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getAllIdentities,
  getUserIdentities,
  setActiveIdentity,
  checkAndUnlockIdentities,
  getIdentityCategoryLabel,
  getIdentityCategoryColor,
  getTierLabel,
  type CognitiveIdentity,
  type UserIdentity,
} from '@/lib/cognitive-identity';
import { useAuth } from '@/lib/auth';
import { Shield, Lock, Check, Sparkles, ChevronRight } from 'lucide-react';

export function CognitiveIdentityCard() {
  const { user, supabase } = useAuth();
  const [allIdentities, setAllIdentities] = useState<CognitiveIdentity[]>([]);
  const [userIdentities, setUserIdentities] = useState<UserIdentity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const [all, mine] = await Promise.all([
        getAllIdentities(),
        getUserIdentities(user.id),
      ]);

      setAllIdentities(all);
      setUserIdentities(mine);

      // Check for new unlocks
      await checkAndUnlockIdentities(user.id);
    } catch (err) {
      console.error('Failed to load identities:', err);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSetActive = async (identityId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await setActiveIdentity(user.id, identityId);
      setUserIdentities((prev) =>
        prev.map((ui) => ({
          ...ui,
          is_active: ui.identity_id === identityId,
        }))
      );
    } catch (err) {
      console.error('Failed to set identity:', err);
    }
  };

  const unlockedSlugs = new Set(userIdentities.map((ui) => ui.identity?.slug).filter(Boolean));
  const activeIdentity = userIdentities.find((ui) => ui.is_active)?.identity;
  const grouped = allIdentities.reduce(
    (acc, id) => {
      if (!acc[id.category]) acc[id.category] = [];
      acc[id.category].push(id);
      return acc;
    },
    {} as Record<string, CognitiveIdentity[]>
  );

  if (loading) {
    return (
      <div className="rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Cognitive Identity</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Your evolving brain archetype</p>
          </div>
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
        >
          {showAll ? 'Collapse' : `View All (${allIdentities.length})`}
        </button>
      </div>

      {/* Active identity */}
      {activeIdentity && (
        <motion.div
          layout
          className={`p-4 rounded-xl bg-gradient-to-r ${getIdentityCategoryColor(activeIdentity.category)} text-white mb-4`}
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl">{activeIdentity.icon_emoji}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{activeIdentity.name}</h4>
                <span className="px-2 py-0.5 rounded-full text-xs bg-white/20">
                  {getTierLabel(activeIdentity.tier)}
                </span>
              </div>
              <p className="text-sm text-white/80">{activeIdentity.description}</p>
            </div>
            <Check className="w-5 h-5 text-white/80" />
          </div>
        </motion.div>
      )}

      {/* Unlocked identities (compact) */}
      {!showAll && (
        <div className="space-y-3">
          {userIdentities
            .filter((ui) => ui.identity)
            .slice(0, 5)
            .map((ui) => (
              <motion.button
                key={ui.id}
                onClick={() => handleSetActive(ui.identity_id)}
                className={`w-full p-3 rounded-xl border text-left transition-all ${
                  ui.is_active
                    ? 'border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-xl">{ui.identity?.icon_emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-gray-900 dark:text-white">
                        {ui.identity?.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {getIdentityCategoryLabel(ui.identity?.category || '')}
                      </span>
                    </div>
                  </div>
                  {ui.is_active && (
                    <Check className="w-4 h-4 text-purple-500" />
                  )}
                </div>
              </motion.button>
            ))}
        </div>
      )}

      {/* All identities (expanded) */}
      <AnimatePresence>
        {showAll && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            {Object.entries(grouped).map(([category, identities]) => (
              <div key={category}>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  {getIdentityCategoryLabel(category)}
                </h4>
                <div className="space-y-2">
                  {identities.map((identity) => {
                    const unlocked = unlockedSlugs.has(identity.slug);
                    return (
                      <motion.button
                        key={identity.id}
                        onClick={() => unlocked && handleSetActive(identity.id)}
                        disabled={!unlocked}
                        className={`w-full p-3 rounded-xl border text-left transition-all ${
                          !unlocked
                            ? 'border-gray-100 dark:border-gray-800 opacity-50 cursor-not-allowed'
                            : activeIdentity?.slug === identity.slug
                            ? 'border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/10'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`text-xl ${!unlocked ? 'grayscale' : ''}`}>
                            {identity.icon_emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm text-gray-900 dark:text-white">
                                {identity.name}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-xs ${
                                unlocked
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                  : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500'
                              }`}>
                                {getTierLabel(identity.tier)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {identity.description}
                            </p>
                          </div>
                          {!unlocked ? (
                            <Lock className="w-4 h-4 text-gray-400" />
                          ) : activeIdentity?.slug === identity.slug ? (
                            <Check className="w-4 h-4 text-purple-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unlock hint */}
      {!showAll && userIdentities.length < allIdentities.length && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition"
          >
            {allIdentities.length - userIdentities.length} more identities to discover →
          </button>
        </div>
      )}
    </div>
  );
}
