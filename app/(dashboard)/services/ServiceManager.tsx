"use client";

import React, { useState } from "react";
import { Plus, Trash, Edit, Check, X, Clock, Banknote, Power } from "lucide-react";
import {
  addService,
  updateService,
  toggleServiceActive,
  deleteService,
} from "@/app/api/widget/booking/actions";

export default function ServiceManager({ initialServices }: { initialServices: any[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Local state for the form
  const [formData, setFormData] = useState({ name: "", duration: 30, price: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addService({
        name: formData.name,
        duration: formData.duration,
        price: formData.price,
      });
      setIsAdding(false);
      setFormData({ name: "", duration: 30, price: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent, id: string, isActive: boolean) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateService(id, {
        name: formData.name,
        duration: formData.duration,
        price: formData.price,
        isActive,
      });
      setEditingId(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (service: any) => {
    setFormData({
      name: service.name,
      duration: service.duration,
      price: service.price || "",
    });
    setEditingId(service.id);
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      await toggleServiceActive(id, !currentStatus);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Czy na pewno chcesz usunąć tę usługę? Upewnij się, że nie ma do niej przypisanych aktywnych rezerwacji.")) {
      try {
        await deleteService(id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-start md:items-center mb-8 flex-col md:flex-row gap-4">
          <div>
            <h1 className="text-2xl font-black text-text">Usługi</h1>
            <p className="text-sm text-text-muted mt-0.5 max-w-md">
              Zarządzaj ofertą, którą widzą Twoi klienci w widżecie rezerwacji. Określ czas trwania, aby kalendarz poprawnie blokował terminy.
            </p>
          </div>
          {!isAdding && (
            <button
              onClick={() => {
                setFormData({ name: "", duration: 30, price: "" });
                setIsAdding(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white font-bold rounded-xl text-sm transition-transform active:scale-95 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Dodaj usługę
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {isAdding && (
            <form
              onSubmit={handleAddSubmit}
              className="p-5 rounded-2xl border bg-[var(--dash-card)] border-[var(--dash-border)] flex flex-col gap-4 shadow-sm animate-in fade-in slide-in-from-top-4"
            >
              <h3 className="text-sm font-bold text-text mb-1">Nowa usługa</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-text-muted mb-1 block">Nazwa usługi *</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="np. Wymiana oleju"
                    className="w-full bg-[var(--dash-bg)] border border-[var(--dash-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] transition-colors text-text"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted mb-1 block">Czas (minuty) *</label>
                  <input
                    required
                    type="number"
                    min="5"
                    step="5"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[var(--dash-bg)] border border-[var(--dash-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] transition-colors text-text"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted mb-1 block">Cena (opcjonalnie)</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="np. od 150 zł"
                    className="w-full bg-[var(--dash-bg)] border border-[var(--dash-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] transition-colors text-text"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-2 border-t border-[var(--dash-border)] pt-4">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-text-muted hover:text-text transition-colors"
                  disabled={isSubmitting}
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[var(--primary)] text-white text-sm font-bold rounded-xl transition-transform active:scale-95 flex items-center gap-2 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" /> Dodaj usługę
                </button>
              </div>
            </form>
          )}

          {initialServices.length === 0 && !isAdding && (
            <div className="flex flex-col items-center justify-center py-16 gap-4 border border-dashed border-[var(--dash-border)] rounded-2xl bg-[var(--dash-card)]/50">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "var(--primary)10" }}
              >
                <Banknote className="w-6 h-6" style={{ color: "var(--primary)" }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-text mb-1">Brak usług</p>
                <p className="text-xs text-text-muted max-w-xs">
                  Dodaj pierwszą usługę, aby klienci mogli się na nią umawiać w widżecie.
                </p>
              </div>
            </div>
          )}

          {initialServices.map((service) => (
            <div
              key={service.id}
              className={`p-5 rounded-2xl border transition-all ${
                service.isActive ? "bg-[var(--dash-card)]" : "bg-[var(--dash-bg)] opacity-70 grayscale-[30%]"
              }`}
              style={{ borderColor: "var(--dash-border)" }}
            >
              {editingId === service.id ? (
                <form onSubmit={(e) => handleEditSubmit(e, service.id, service.isActive)} className="flex flex-col gap-4 animate-in fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-text-muted mb-1 block">Nazwa usługi</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[var(--dash-bg)] border border-[var(--dash-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] text-text transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-text-muted mb-1 block">Czas (minuty)</label>
                      <input
                        required
                        type="number"
                        min="5"
                        step="5"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[var(--dash-bg)] border border-[var(--dash-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] text-text transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-text-muted mb-1 block">Cena</label>
                      <input
                        type="text"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full bg-[var(--dash-bg)] border border-[var(--dash-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] text-text transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-2 border-t border-[var(--dash-border)] pt-4">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-5 py-2.5 text-sm font-semibold text-text-muted hover:text-text transition-colors"
                      disabled={isSubmitting}
                    >
                      Anuluj
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-6 py-2.5 bg-[var(--primary)] text-white text-sm font-bold rounded-xl transition-transform active:scale-95 disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" /> Zapisz zmiany
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                  <div className="flex-1 min-w-[200px]">
                    <h4 className="font-bold text-text flex items-center gap-2.5 text-base">
                      {service.name}
                      {!service.isActive && (
                        <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-md bg-red-500/10 text-red-500">
                          Wyłączona
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-5 mt-2.5 text-xs font-medium text-text-muted">
                      <span className="flex items-center gap-1.5 opacity-80">
                        <Clock className="w-4 h-4" /> {service.duration} min
                      </span>
                      {service.price && (
                        <span className="flex items-center gap-1.5 opacity-80">
                          <Banknote className="w-4 h-4" /> {service.price}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(service.id, service.isActive)}
                      className={`p-2.5 rounded-xl flex items-center justify-center transition-colors ${
                        service.isActive 
                          ? "text-green-500 hover:bg-green-500/10" 
                          : "text-text-muted hover:text-green-500 hover:bg-green-500/10"
                      }`}
                      title={service.isActive ? "Wyłącz" : "Włącz"}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditClick(service)}
                      className="p-2.5 rounded-xl text-text-muted hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors"
                      title="Edytuj"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2.5 rounded-xl text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Usuń"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
