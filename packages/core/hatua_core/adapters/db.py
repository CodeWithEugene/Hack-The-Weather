from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4
from zoneinfo import ZoneInfo

from sqlalchemy import (
    JSON,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    TypeDecorator,
    UniqueConstraint,
    create_engine,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker

EAT = ZoneInfo("Africa/Nairobi")


class UTCDateTime(TypeDecorator):
    """Store UTC as naive datetime so SQLite comparisons stay consistent."""

    impl = DateTime
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if value.tzinfo is None:
            value = value.replace(tzinfo=timezone.utc)
        return value.astimezone(timezone.utc).replace(tzinfo=None)

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        if value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)
        return value.astimezone(timezone.utc)


class Base(DeclarativeBase):
    pass


class StationRow(Base):
    __tablename__ = "stations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    site_id: Mapped[int] = mapped_column(Integer, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    lon: Mapped[float] = mapped_column(Float, nullable=False)
    lat: Mapped[float] = mapped_column(Float, nullable=False)
    elev_m: Mapped[float] = mapped_column(Float, nullable=False)
    timezone: Mapped[str] = mapped_column(String(64), default="Africa/Nairobi")
    cadence_s: Mapped[int] = mapped_column(Integer, default=61)


class ObservationRow(Base):
    __tablename__ = "observations"

    station_id: Mapped[int] = mapped_column(
        ForeignKey("stations.id"), primary_key=True
    )
    observed_at: Mapped[datetime] = mapped_column(UTCDateTime(), primary_key=True)
    payload: Mapped[dict] = mapped_column(JSON, nullable=False)
    rg: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    rg2: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    st1: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    bt1: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    mt1: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    sh1: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    wbgt: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    hi: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    su1: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    ws: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    wg: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    hth: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    source: Mapped[str] = mapped_column(String(32), default="csv")
    ingest_run_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)


class TrustRow(Base):
    __tablename__ = "trust_verdicts"

    station_id: Mapped[int] = mapped_column(
        ForeignKey("stations.id"), primary_key=True
    )
    observed_at: Mapped[datetime] = mapped_column(UTCDateTime(), primary_key=True)
    status: Mapped[str] = mapped_column(String(16), nullable=False)
    score: Mapped[float] = mapped_column(Float, nullable=False)
    flags: Mapped[list] = mapped_column(JSON, nullable=False)
    policy_id: Mapped[str] = mapped_column(String(32), default="trust_v1")
    details: Mapped[dict] = mapped_column(JSON, nullable=False)


class ActionRow(Base):
    __tablename__ = "actions"
    __table_args__ = (
        UniqueConstraint(
            "station_id", "kind", "valid_from", name="uq_action_window"
        ),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    station_id: Mapped[int] = mapped_column(ForeignKey("stations.id"), nullable=False)
    kind: Mapped[str] = mapped_column(String(32), nullable=False)
    status: Mapped[str] = mapped_column(String(16), nullable=False)
    valid_from: Mapped[datetime] = mapped_column(UTCDateTime(), nullable=False)
    valid_until: Mapped[datetime] = mapped_column(UTCDateTime(), nullable=False)
    policy_id: Mapped[str] = mapped_column(String(32), default="actions_v1")
    trust_status: Mapped[str] = mapped_column(String(16), nullable=False)
    explanation: Mapped[dict] = mapped_column(JSON, nullable=False)
    headline: Mapped[Optional[str]] = mapped_column(Text, nullable=True)


class ResidualRow(Base):
    __tablename__ = "residuals"
    __table_args__ = (
        UniqueConstraint("station_id", "valid_at", "model_id", name="uq_residual"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    station_id: Mapped[int] = mapped_column(ForeignKey("stations.id"), nullable=False)
    valid_at: Mapped[datetime] = mapped_column(UTCDateTime(), nullable=False)
    conduit_mm: Mapped[float] = mapped_column(Float, nullable=False)
    model_mm: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    model_id: Mapped[str] = mapped_column(String(64), nullable=False)
    delta_mm: Mapped[Optional[float]] = mapped_column(Float, nullable=True)


class EventRow(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    ts: Mapped[datetime] = mapped_column(UTCDateTime(), nullable=False)
    type: Mapped[str] = mapped_column(String(64), nullable=False)
    station_id: Mapped[int] = mapped_column(Integer, nullable=False)
    payload: Mapped[dict] = mapped_column(JSON, nullable=False)


class IngestRunRow(Base):
    __tablename__ = "ingest_runs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    source: Mapped[str] = mapped_column(String(32), nullable=False)
    started_at: Mapped[datetime] = mapped_column(UTCDateTime(), nullable=False)
    finished_at: Mapped[Optional[datetime]] = mapped_column(UTCDateTime(), nullable=True)
    rows_ok: Mapped[int] = mapped_column(Integer, default=0)
    rows_dead: Mapped[int] = mapped_column(Integer, default=0)
    error: Mapped[Optional[str]] = mapped_column(Text, nullable=True)


class DeadLetterRow(Base):
    __tablename__ = "dead_letters"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    raw: Mapped[str] = mapped_column(Text, nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    seen_at: Mapped[datetime] = mapped_column(UTCDateTime(), nullable=False)


class OutboxRow(Base):
    __tablename__ = "outbox"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    action_id: Mapped[str] = mapped_column(String(36), nullable=False)
    channel: Mapped[str] = mapped_column(String(32), default="log")
    payload: Mapped[dict] = mapped_column(JSON, nullable=False)
    status: Mapped[str] = mapped_column(String(16), default="pending")


class ReplayRow(Base):
    __tablename__ = "replay_clock"

    station_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    as_of: Mapped[datetime] = mapped_column(UTCDateTime(), nullable=False)


class SourceStateRow(Base):
    __tablename__ = "source_state"

    key: Mapped[str] = mapped_column(String(32), primary_key=True)
    value: Mapped[str] = mapped_column(String(64), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(UTCDateTime(), nullable=False)


def make_engine(url: str):
    connect_args = {}
    if url.startswith("sqlite"):
        connect_args["check_same_thread"] = False
    engine = create_engine(url, future=True, connect_args=connect_args)
    return engine


def make_session_factory(url: str):
    engine = make_engine(url)
    Base.metadata.create_all(engine)
    return sessionmaker(engine, expire_on_commit=False, future=True)
