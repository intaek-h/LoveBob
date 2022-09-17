import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";

interface Props {
  children?: React.ReactNode;
  title: string;
}

export default function CustomizedAccordions({ title, children }: Props & AccordionProps) {
  return (
    <div>
      <Accordion>
        <AccordionSummary>
          <span>{title}</span>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    </div>
  );
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid #347fff`,
  borderRadius: 3,

  "&:not(:last-child)": {
    borderBottom: 0,
  },

  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem", color: "#347fff" }} />}
    style={{
      backgroundColor: "#ecf9ff",
      borderRadius: 3,
    }}
    {...props}
  />
))(({ theme }) => ({
  minHeight: 0,
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(255, 255, 255, .05)" : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",

  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },

  "& .MuiAccordionSummary-content": {
    margin: "8px 0",
    marginLeft: theme.spacing(1),
    color: "#347fff",
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));
